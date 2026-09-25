'use client';

import { ResumeData } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  activeSection?: string;
}

export default function ClassicTemplate({ data, activeSection }: TemplateProps) {
  const { personalInfo: pi, workExperience, education, skills, projects, certifications } = data;

  const hasName = Boolean(pi.name?.trim());
  const hasContact = Boolean(pi.email || pi.phone || pi.location || pi.linkedin || pi.github || pi.website);
  const hasSummary = Boolean(pi.summary?.trim());
  const hasExp = workExperience.length > 0;
  const hasEdu = education.length > 0;
  const hasSkills = skills.length > 0 && skills.some(s => s.items.length > 0);
  const hasProjects = projects.length > 0;
  const hasCerts = certifications.length > 0;

  return (
    <div
      style={{
        fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
        fontSize: '13px',
        lineHeight: '1.65',
        color: '#18181b',
        backgroundColor: '#ffffff',
        width: '794px',
        minHeight: '1123px',
        margin: '0 auto',
        padding: '56px 60px',
        boxSizing: 'border-box',
      }}
    >
      {/* Centered Editorial Serif Header */}
      <header
        style={{
          textAlign: 'center',
          marginBottom: '26px',
          borderBottom: '1px solid #18181b',
          paddingBottom: '22px',
          outline: activeSection === 'header' ? '1px solid #2F5D3A' : 'none',
          backgroundColor: activeSection === 'header' ? 'rgba(47, 93, 58, 0.08)' : 'transparent',
          outlineOffset: '6px',
          borderRadius: '4px',
          transition: 'all 0.15s ease',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            color: hasName ? '#09090b' : '#a1a1aa',
          }}
        >
          {hasName ? pi.name : 'Jane Eleanor Vance'}
        </h1>

        <div
          style={{
            fontSize: '12.5px',
            color: hasContact ? '#3f3f46' : '#a1a1aa',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {pi.email ? <span>{pi.email}</span> : !hasContact && <span>j.vance@law.columbia.edu</span>}
          {pi.phone && <span>· {pi.phone}</span>}
          {pi.location && <span>· {pi.location}</span>}
          {pi.linkedin && <span>· {pi.linkedin}</span>}
          {pi.github && <span>· {pi.github}</span>}
          {pi.website && <span>· {pi.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {(hasSummary || (!hasExp && !hasEdu)) && (
        <Section title="SUMMARY OF QUALIFICATIONS" isHighlighted={activeSection === 'summary'}>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: '1.7',
              color: hasSummary ? '#27272a' : '#a1a1aa',
              fontStyle: hasSummary ? 'normal' : 'italic',
            }}
          >
            {hasSummary
              ? pi.summary
              : 'Accomplished legal counselor and corporate governance advisor with ten years of cross-border arbitration experience. Proven record in risk management, international dispute resolution, and contractual negotiations across financial and technological sectors.'}
          </p>
        </Section>
      )}

      {/* Experience */}
      {(hasExp || !hasEdu) && (
        <Section title="PROFESSIONAL EXPERIENCE" isHighlighted={activeSection === 'experience'}>
          {hasExp ? (
            workExperience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '14.5px', color: '#09090b' }}>{exp.title || 'Role Title'}</span>
                    <span style={{ fontStyle: 'italic', color: '#3f3f46', fontSize: '13.5px', marginLeft: '6px' }}>
                      , {exp.company || 'Institution'}
                    </span>
                    {exp.location && <span style={{ color: '#52525b', fontSize: '13px' }}> — {exp.location}</span>}
                  </div>
                  <span style={{ color: '#52525b', fontStyle: 'italic', fontSize: '12.5px', fontVariantNumeric: 'tabular-nums' }}>
                    {exp.startDate || '2020'} — {exp.current ? 'Present' : exp.endDate || '2023'}
                  </span>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: '8px 0 0 22px', padding: 0 }}>
                    {exp.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: '5px', color: '#27272a', fontSize: '13px', lineHeight: '1.65' }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div style={{ marginBottom: '16px', color: '#a1a1aa', fontStyle: 'italic' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>
                  <strong style={{ fontStyle: 'normal' }}>Senior Counsel, International Trade</strong>, Sterling &amp; Partners — Geneva
                </span>
                <span>2020 — Present</span>
              </div>
              <ul style={{ margin: '6px 0 0 20px', padding: 0 }}>
                <li>Advised Fortune 100 enterprise clients on multilateral trade regulations and treaty compliances.</li>
                <li>Negotiated commercial settlement terms exceeding $140M in aggregate dispute value.</li>
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* Education */}
      {(hasEdu || !hasExp) && (
        <Section title="EDUCATION" isHighlighted={activeSection === 'education'}>
          {hasEdu ? (
            education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#09090b' }}>{edu.degree || 'Degree'}</span>
                  <span style={{ fontStyle: 'italic', color: '#3f3f46', marginLeft: '6px', fontSize: '13.5px' }}>
                    , {edu.school || 'University'}
                  </span>
                  {edu.location && <span style={{ color: '#52525b', fontSize: '13px' }}> ({edu.location})</span>}
                  {edu.gpa && <span style={{ color: '#71717a', fontSize: '12.5px' }}> [GPA: {edu.gpa}]</span>}
                </div>
                <span style={{ color: '#52525b', fontStyle: 'italic', fontSize: '12.5px', fontVariantNumeric: 'tabular-nums' }}>
                  {edu.graduationDate || '2019'}
                </span>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontStyle: 'italic' }}>
              <div>
                <strong style={{ fontStyle: 'normal' }}>Juris Doctor (J.D.), Magna Cum Laude</strong>, Columbia Law School
              </div>
              <span>2019</span>
            </div>
          )}
        </Section>
      )}

      {/* Skills */}
      {(hasSkills || (!hasExp && !hasEdu)) && (
        <Section title="AREAS OF EXPERTISE" isHighlighted={activeSection === 'skills'}>
          {hasSkills ? (
            skills.map((group, i) => (
              <div key={i} style={{ marginBottom: '6px', fontSize: '13px', color: '#27272a' }}>
                <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '12px' }}>
                  {group.category}:{' '}
                </span>
                <span>{group.items.join(', ')}</span>
              </div>
            ))
          ) : (
            <div style={{ color: '#a1a1aa', fontStyle: 'italic' }}>
              <span>Cross-Border Compliance, Corporate Governance, Bilateral Treaties, Financial Risk Audit, Contractual Drafting</span>
            </div>
          )}
        </Section>
      )}

      {/* Projects */}
      {hasProjects && (
        <Section title="PUBLICATIONS &amp; PROJECTS" isHighlighted={activeSection === 'additional'}>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#09090b' }}>{proj.name}</span>
                {proj.url && <span style={{ color: '#52525b', fontStyle: 'italic', fontSize: '12.5px' }}>{proj.url}</span>}
              </div>
              {proj.technologies.length > 0 && (
                <span style={{ color: '#71717a', fontStyle: 'italic', fontSize: '12.5px' }}>{proj.technologies.join(', ')}</span>
              )}
              {proj.description && <p style={{ margin: '4px 0 0 0', fontSize: '13px', lineHeight: '1.65', color: '#27272a' }}>{proj.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {hasCerts && (
        <Section title="CERTIFICATIONS &amp; LICENSES" isHighlighted={activeSection === 'additional'}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '13px', color: '#27272a' }}>
                <span style={{ fontWeight: '700' }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontStyle: 'italic', color: '#52525b' }}> — {cert.issuer}</span>}
              </span>
              <span style={{ color: '#52525b', fontStyle: 'italic', fontSize: '12.5px' }}>{cert.date}</span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  isHighlighted,
}: {
  title: string;
  children: React.ReactNode;
  isHighlighted?: boolean;
}) {
  return (
    <section
      style={{
        marginBottom: '24px',
        border: isHighlighted ? '1px solid #2F5D3A' : '1px solid transparent',
        borderRadius: '4px',
        padding: isHighlighted ? '8px 10px' : '0',
        backgroundColor: isHighlighted ? 'rgba(47, 93, 58, 0.08)' : 'transparent',
        transition: 'all 0.15s ease',
      }}
    >
      <h2
        style={{
          fontSize: '12.5px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          color: '#18181b',
          borderBottom: '1px solid #d4d4d8',
          paddingBottom: '4px',
          marginBottom: '10px',
          margin: '0 0 10px 0',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
