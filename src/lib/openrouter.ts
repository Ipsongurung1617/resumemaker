import { ResumeData, WorkExperience, Education, SkillGroup } from '@/types/resume';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = 'google/gemini-2.0-flash-exp:free';

/**
 * Universal LLM caller: tries NVIDIA first (fast & reliable), falls back to OpenRouter.
 */
async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
  // 1. Try NVIDIA NIM first
  if (NVIDIA_API_KEY) {
    try {
      const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return content.trim();
        }
      } else {
        console.warn(`[AI] NVIDIA NIM returned ${res.status}, falling back to OpenRouter...`);
      }
    } catch (err) {
      console.warn('[AI] NVIDIA NIM request failed, falling back to OpenRouter...', err);
    }
  }

  // 2. Fallback to OpenRouter (Gemini / Free models)
  try {
    const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ATSResumeBuilder.ai',
        'X-Title': 'ATSResumeBuilder Resume Builder',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (content && content.trim().length > 0) {
        return content.trim();
      }
    }
    const errText = await res.text();
    throw new Error(`OpenRouter error (${res.status}): ${errText}`);
  } catch (error) {
    console.error('[AI] Both NVIDIA and OpenRouter failed:', error);
    throw new Error('AI service temporarily unavailable. Please verify API keys or try again.');
  }
}

function stripJsonFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```$/m, '')
    .trim();
}

/**
 * Rewrites a resume bullet point to make it concise, impact-driven, and ATS-compliant.
 * No fluff, no robotic filler words.
 */
export async function rewriteBullet(bullet: string, jobTitle: string): Promise<string> {
  const system = `You are a certified professional resume writer. Your job is to improve resume bullet points.
Guidelines:
- Start with a strong action verb (e.g. Engineered, Spearheaded, Accelerated, Reduced, Designed).
- Focus on business impact, metrics, or specific technical outcomes.
- Keep tone professional, natural, concise (1-2 lines). Avoid generic buzzwords like "synergized" or "rockstar".
- Return ONLY the rewritten bullet point text. Do not wrap in quotes or add commentary.`;

  const user = `Target Role: ${jobTitle || 'General Professional'}
Original bullet: ${bullet}
Write a high-impact, ATS-optimized version:`;

  const result = await callAI(system, user);
  return result.replace(/^["'\-•]\s*/, '').replace(/["']$/, '').trim();
}

/**
 * Analyzes resume against job description and provides actionable tailoring feedback.
 */
export async function tailorResume(resumeData: ResumeData, jobDescription: string): Promise<string[]> {
  const system = `You are an executive ATS recruiter. Analyze the candidate's resume against the target job description.
Identify the top 5 concrete, actionable adjustments to increase ATS match rate.
Guidelines:
- Mention specific missing hard skills, certifications, or keywords found in the job description.
- Suggest exact phrasing or bullet point adjustments.
- Return ONLY a valid JSON array of exactly 5 concise strings. No markdown code blocks, no text outside the array.`;

  const user = `RESUME SUMMARY & SKILLS:
${resumeData.personalInfo.summary || 'None'}
Skills: ${resumeData.skills.map(s => `${s.category}: ${s.items.join(', ')}`).join(' | ')}
Experience titles: ${resumeData.workExperience.map(w => `${w.title} at ${w.company}`).join('; ')}

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

Output format: ["Suggestion 1", "Suggestion 2", "Suggestion 3", "Suggestion 4", "Suggestion 5"]`;

  const raw = await callAI(system, user);
  try {
    const cleaned = stripJsonFences(raw);
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 5).map(s => String(s));
    }
  } catch {
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]).slice(0, 5);
      } catch {}
    }
  }

  // Fallback if parsing failed
  const lines = raw.split('\n').filter(l => l.trim().length > 10).slice(0, 5);
  return lines.length > 0 ? lines : ['Align summary with target role keywords in the job description.'];
}

export interface LinkedInAnalysisResult {
  parsedData: Partial<ResumeData>;
  analysisSummary: string;
  extractedSkillsCount: number;
  extractedRolesCount: number;
}

/**
 * Automatically fetches public LinkedIn profile data from a URL or username.
 */
export async function fetchLinkedInProfile(input: string): Promise<string> {
  let clean = input.trim().replace(/^@/, '');
  clean = clean.split('?')[0].split('#')[0].replace(/\/+$/, '');

  let targetUrl = '';
  if (clean.includes('linkedin.com')) {
    targetUrl = clean.startsWith('http') ? clean : `https://${clean}`;
  } else {
    // User provided username / handle
    const handle = clean.replace(/^in\//, '').replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9_-]/g, '');
    targetUrl = `https://www.linkedin.com/in/${handle}`;
  }

  if (targetUrl.includes('linkedin.com/') && !targetUrl.includes('/in/') && !targetUrl.includes('/pub/')) {
    targetUrl = targetUrl.replace('linkedin.com/', 'linkedin.com/in/');
  }

  // SSRF Protection: Validate targetUrl is strictly HTTPS and hosted on linkedin.com
  try {
    const parsed = new URL(targetUrl);
    const validHostnames = ['linkedin.com', 'www.linkedin.com'];
    if (parsed.protocol !== 'https:' || !validHostnames.includes(parsed.hostname.toLowerCase())) {
      throw new Error('Invalid LinkedIn URL domain.');
    }
  } catch {
    throw new Error('Invalid LinkedIn profile URL. Only https://linkedin.com or https://www.linkedin.com is allowed.');
  }

  const res = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!res.ok) {
    throw new Error(`LinkedIn returned ${res.status}. Profile may be private or restricted by LinkedIn.`);
  }

  const html = await res.text();
  const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
  const ogTitle = html.match(/<meta property="og:title" content="([\s\S]*?)"/i)?.[1] || '';
  const ogDesc = html.match(/<meta property="og:description" content="([\s\S]*?)"/i)?.[1] || '';

  // Extract structured schema if available
  let structuredData = '';
  const ldJsonMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (ldJsonMatches) {
    for (const match of ldJsonMatches) {
      const inner = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
      if (inner.includes('Person') || inner.includes('alumniOf') || inner.includes('worksFor')) {
        structuredData += `\nSchema Details: ${inner}`;
      }
    }
  }

  const cleanText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `LinkedIn Profile Data for ${targetUrl}:
Page Title: ${pageTitle}
Headline / Role: ${ogTitle}
Summary / Experience / Highlights: ${ogDesc}
${structuredData}
Public Profile Body Text:
${cleanText.slice(0, 4500)}`;
}

/**
 * Parses and analyzes raw text from LinkedIn profile export or bio.
 * Can either build fresh or merge with existing user-provided info.
 */
export async function parseLinkedIn(
  linkedinText: string,
  existingData?: ResumeData,
  mode: 'replace' | 'merge' = 'merge'
): Promise<LinkedInAnalysisResult> {
  const system = `You are a resume data parser. Extract structured career information from raw LinkedIn profile text.
Return ONLY a valid JSON object with this exact structure:
{
  "summary": "1-2 sentence overview of the candidate's core background",
  "personalInfo": {
    "name": "Full Name",
    "email": "Email if present",
    "phone": "Phone if present",
    "location": "City, State/Country",
    "linkedin": "LinkedIn profile link or username",
    "summary": "Professional summary"
  },
  "workExperience": [
    {
      "id": "exp-1",
      "title": "Role Title",
      "company": "Company Name",
      "location": "Location",
      "startDate": "Start date",
      "endDate": "End date",
      "current": false,
      "bullets": ["Achievement or duty 1", "Achievement or duty 2"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "degree": "Degree and Major",
      "school": "Institution",
      "location": "Location",
      "graduationDate": "Year or date",
      "gpa": ""
    }
  ],
  "skills": [
    { "category": "Core Competencies", "items": ["Skill 1", "Skill 2"] },
    { "category": "Tools & Technologies", "items": ["Tool 1", "Tool 2"] }
  ]
}
Return ONLY valid JSON. Do not include markdown ticks (\`\`\`).`;

  const user = `Parse the following LinkedIn profile data into clean resume JSON:\n\n${linkedinText.substring(0, 4500)}`;

  const raw = await callAI(system, user);
  let parsed: any = {};

  try {
    const cleaned = stripJsonFences(raw);
    parsed = JSON.parse(cleaned);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (e) {
        throw new Error('Failed to parse LinkedIn text structure. Please verify the copied text.');
      }
    } else {
      throw new Error('Unable to extract structured resume data from the provided LinkedIn text.');
    }
  }

  // Combine or Merge with existing data if requested
  let finalData: Partial<ResumeData> = {};

  if (mode === 'merge' && existingData) {
    // Intelligent merge: keep user's manual inputs if already present, fill in gaps from LinkedIn
    finalData = {
      personalInfo: {
        name: existingData.personalInfo.name || parsed.personalInfo?.name || '',
        email: existingData.personalInfo.email || parsed.personalInfo?.email || '',
        phone: existingData.personalInfo.phone || parsed.personalInfo?.phone || '',
        location: existingData.personalInfo.location || parsed.personalInfo?.location || '',
        linkedin: existingData.personalInfo.linkedin || parsed.personalInfo?.linkedin || '',
        github: existingData.personalInfo.github || '',
        website: existingData.personalInfo.website || '',
        summary: existingData.personalInfo.summary || parsed.personalInfo?.summary || parsed.summary || '',
      },
      workExperience: [
        ...(existingData.workExperience || []),
        ...(Array.isArray(parsed.workExperience) ? parsed.workExperience.map((w: any, idx: number) => ({
          ...w,
          id: w.id || `li-exp-${Date.now()}-${idx}`,
          bullets: Array.isArray(w.bullets) ? w.bullets.filter(Boolean) : [],
        })) : []),
      ],
      education: [
        ...(existingData.education || []),
        ...(Array.isArray(parsed.education) ? parsed.education.map((e: any, idx: number) => ({
          ...e,
          id: e.id || `li-edu-${Date.now()}-${idx}`,
        })) : []),
      ],
      skills: mergeSkills(existingData.skills, parsed.skills),
      projects: existingData.projects || [],
      certifications: existingData.certifications || [],
    };
  } else {
    finalData = {
      personalInfo: {
        name: parsed.personalInfo?.name || '',
        email: parsed.personalInfo?.email || '',
        phone: parsed.personalInfo?.phone || '',
        location: parsed.personalInfo?.location || '',
        linkedin: parsed.personalInfo?.linkedin || '',
        github: '',
        website: '',
        summary: parsed.personalInfo?.summary || parsed.summary || '',
      },
      workExperience: Array.isArray(parsed.workExperience)
        ? parsed.workExperience.map((w: any, idx: number) => ({
            id: w.id || `li-exp-${Date.now()}-${idx}`,
            title: w.title || '',
            company: w.company || '',
            location: w.location || '',
            startDate: w.startDate || '',
            endDate: w.endDate || '',
            current: Boolean(w.current),
            bullets: Array.isArray(w.bullets) ? w.bullets.filter(Boolean) : [],
          }))
        : [],
      education: Array.isArray(parsed.education)
        ? parsed.education.map((e: any, idx: number) => ({
            id: e.id || `li-edu-${Date.now()}-${idx}`,
            degree: e.degree || '',
            school: e.school || '',
            location: e.location || '',
            graduationDate: e.graduationDate || '',
            gpa: e.gpa || '',
          }))
        : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      projects: [],
      certifications: [],
    };
  }

  const skillsCount = finalData.skills?.reduce((acc, s) => acc + s.items.length, 0) || 0;
  const rolesCount = finalData.workExperience?.length || 0;

  return {
    parsedData: finalData,
    analysisSummary: parsed.summary || `Extracted ${rolesCount} roles and ${skillsCount} skills from LinkedIn profile.`,
    extractedSkillsCount: skillsCount,
    extractedRolesCount: rolesCount,
  };
}

function mergeSkills(existing: SkillGroup[] = [], incoming: any[] = []): SkillGroup[] {
  const map = new Map<string, Set<string>>();

  existing.forEach(g => {
    const cat = g.category.trim() || 'General Skills';
    if (!map.has(cat)) map.set(cat, new Set());
    g.items.forEach(i => map.get(cat)!.add(i.trim()));
  });

  if (Array.isArray(incoming)) {
    incoming.forEach((g: any) => {
      const cat = (g.category || 'Extracted Skills').trim();
      if (!map.has(cat)) map.set(cat, new Set());
      if (Array.isArray(g.items)) {
        g.items.forEach((i: string) => map.get(cat)!.add(String(i).trim()));
      }
    });
  }

  const result: SkillGroup[] = [];
  map.forEach((itemsSet, category) => {
    result.push({
      category,
      items: Array.from(itemsSet).filter(Boolean),
    });
  });

  return result.length > 0 ? result : [{ category: 'Technical Skills', items: [] }];
}

/**
 * Transforms raw user career descriptions, notes, or role summaries into clean, structured resume sections.
 */
export async function parseUserDescription(description: string, targetRole: string): Promise<Partial<ResumeData>> {
  const system = `You are a certified professional resume writer. Given a user's description of their work experience, duties, or career background, organize it into clean, structured resume JSON.
Ensure bullets begin with action verbs and include metrics/impact where applicable.
Return ONLY a valid JSON object matching this structure:
{
  "personalInfo": {
    "name": "",
    "summary": "Polished executive summary based on the provided background",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "workExperience": [
    {
      "id": "desc-exp-1",
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location if specified",
      "startDate": "Year/Date",
      "endDate": "Year/Date or Present",
      "current": false,
      "bullets": ["Action-oriented accomplishment 1", "Action-oriented accomplishment 2"]
    }
  ],
  "education": [
    {
      "id": "desc-edu-1",
      "degree": "Degree and Major",
      "school": "Institution",
      "location": "",
      "graduationDate": "Year",
      "gpa": ""
    }
  ],
  "skills": [
    { "category": "Core Competencies", "items": ["Skill 1", "Skill 2"] },
    { "category": "Tools & Technologies", "items": ["Tool 1", "Tool 2"] }
  ]
}
Return ONLY valid JSON. No markdown ticks.`;

  const user = `Target Role / Title: ${targetRole || 'Professional'}
User Career Description:
${description.substring(0, 4000)}`;

  const raw = await callAI(system, user);
  try {
    const cleaned = stripJsonFences(raw);
    const parsed = JSON.parse(cleaned);
    return {
      personalInfo: {
        name: parsed.personalInfo?.name || '',
        email: parsed.personalInfo?.email || '',
        phone: parsed.personalInfo?.phone || '',
        location: parsed.personalInfo?.location || '',
        linkedin: parsed.personalInfo?.linkedin || '',
        github: '',
        website: '',
        summary: parsed.personalInfo?.summary || '',
      },
      workExperience: Array.isArray(parsed.workExperience)
        ? parsed.workExperience.map((w: any, idx: number) => ({
            id: w.id || `desc-exp-${Date.now()}-${idx}`,
            title: w.title || '',
            company: w.company || '',
            location: w.location || '',
            startDate: w.startDate || '',
            endDate: w.endDate || '',
            current: Boolean(w.current),
            bullets: Array.isArray(w.bullets) ? w.bullets.filter(Boolean) : [],
          }))
        : [],
      education: Array.isArray(parsed.education)
        ? parsed.education.map((e: any, idx: number) => ({
            id: e.id || `desc-edu-${Date.now()}-${idx}`,
            degree: e.degree || '',
            school: e.school || '',
            location: e.location || '',
            graduationDate: e.graduationDate || '',
            gpa: e.gpa || '',
          }))
        : [],
      skills: Array.isArray(parsed.skills) && parsed.skills.length > 0
        ? parsed.skills
        : [{ category: 'Core Competencies', items: [] }],
      projects: [],
      certifications: [],
    };
  } catch (err) {
    console.error('[AI] parseUserDescription JSON parse error:', err);
    return {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: description.slice(0, 300),
      },
      workExperience: [],
      education: [],
      skills: [{ category: 'Core Competencies', items: [] }],
      projects: [],
      certifications: [],
    };
  }
}

