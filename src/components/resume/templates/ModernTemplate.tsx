'use client';

import { ResumeData } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  activeSection?: string;
}

export default function ModernTemplate({ data, activeSection }: TemplateProps) {
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
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: '13px',
        lineHeight: '1.6',
        color: '#18181b',
        backgroundColor: '#ffffff',
        width: '794px',
        minHeight: '1123px',
        margin: '0 auto',
        padding: '52px 56px',
        boxSizing: 'border-box',
      }}
    >
      {/* Editorial Header */}
      <header
        style={{
          borderBottom: '2px solid #18181b',
          paddingBottom: '20px',
          marginBottom: '28px',
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
            fontWeight: '800',
            letterSpacing: '-0.025em',
            margin: '0 0 6px 0',
            color: hasName ? '#09090b' : '#a1a1aa',
            textTransform: 'uppercase',
          }}
        >
          {hasName ? pi.name : 'Candidate Full Name'}
        </h1>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 18px',
            fontSize: '12.5px',
            color: hasContact ? '#52525b' : '#a1a1aa',
            marginTop: '10px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {pi.email ? <span>{pi.email}</span> : !hasContact && <span>candidate@domain.com</span>}
          {pi.phone && <span>· {pi.phone}</span>}
          {pi.location && <span>· {pi.location}</span>}
          {pi.linkedin && <span>· {pi.linkedin}</span>}
          {pi.github && <span>· {pi.github}</span>}
          {pi.website && <span>· {pi.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {(hasSummary || (!hasExp && !hasEdu)) && (
        <Section title="Executive Profile" isHighlighted={activeSection === 'summary'}>
          <p
            style={{
              margin: 0,
              color: hasSummary ? '#3f3f46' : '#a1a1aa',
              fontSize: '13px',
              lineHeight: '1.65',
              fontStyle: hasSummary ? 'normal' : 'italic',
            }}
          >
            {hasSummary
              ? pi.summary
              : 'Senior executive with a track record of driving cross-functional alignment, scaling critical operations, and translating ambitious strategic visions into measurable market outcomes.'}
          </p>
        </Section>
      )}

      {/* Work Experience */}
      {(hasExp || !hasEdu) && (
        <Section title="Professional Experience" isHighlighted={activeSection === 'experience'}>
          {hasExp ? (
            workExperience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '14.5px', color: '#09090b', letterSpacing: '-0.01em' }}>
                      {exp.title || 'Role / Title'}
                    </span>
                    <span style={{ color: '#52525b', fontWeight: '500', marginLeft: '8px', fontSize: '13.5px' }}>
                      — {exp.company || 'Organization'}{exp.location ? `, ${exp.location}` : ''}
                    </span>
                  </div>
                  <span style={{ color: '#71717a', fontSize: '12px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
                    {exp.startDate || '2021'} — {exp.current ? 'Present' : exp.endDate || '2024'}
                  </span>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                    {exp.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: '5px', color: '#3f3f46', fontSize: '13px', lineHeight: '1.6' }}>
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
                <span style={{ fontWeight: '600' }}>Senior Director of Product Engineering — Acme Global</span>
                <span style={{ fontSize: '12px' }}>2021 — Present</span>
              </div>
              <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                <li>Led 42-engineer platform organization delivering high-availability infrastructure supporting 10M+ daily active sessions.</li>
                <li>Architected real-time streaming pipeline reducing data ingestion latency by 45%.</li>
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* Education */}
      {(hasEdu || !hasExp) && (
        <Section title="Education & Credentials" isHighlighted={activeSection === 'education'}>
          {hasEdu ? (
            education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#09090b' }}>{edu.degree || 'Degree Program'}</span>
                  <span style={{ color: '#52525b', marginLeft: '8px', fontSize: '13.5px' }}>
                    — {edu.school || 'Institution'}{edu.location ? `, ${edu.location}` : ''}
                  </span>
                  {edu.gpa && <span style={{ color: '#71717a', marginLeft: '6px', fontSize: '12.5px' }}>(GPA: {edu.gpa})</span>}
                </div>
                <span style={{ color: '#71717a', fontSize: '12px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                  {edu.graduationDate || '2020'}
                </span>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontStyle: 'italic' }}>
              <div>
                <span style={{ fontWeight: '600' }}>B.S. in Computer Science & Applied Mathematics</span>
                <span> — University of California, Berkeley</span>
              </div>
              <span style={{ fontSize: '12px' }}>2018 — 2022</span>
            </div>
          )}
        </Section>
      )}

      {/* Skills */}
      {(hasSkills || (!hasExp && !hasEdu)) && (
        <Section title="Core Competencies" isHighlighted={activeSection === 'skills'}>
          {hasSkills ? (
            skills.filter(s => s.items.length > 0).map((group, i) => (
              <div key={i} style={{ marginBottom: '10px', display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', color: '#18181b', minWidth: '140px', fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {group.category}:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {group.items.map((item, j) => (
                    <span
                      key={j}
                      style={{
                        backgroundColor: '#f4f4f5',
                        color: '#18181b',
                        border: '1px solid #e4e4e7',
                        padding: '2.5px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', gap: '8px', color: '#a1a1aa' }}>
              <span style={{ padding: '2px 8px', background: '#f4f4f5', borderRadius: '3px', fontSize: '12px' }}>Distributed Systems</span>
              <span style={{ padding: '2px 8px', background: '#f4f4f5', borderRadius: '3px', fontSize: '12px' }}>Cloud Architecture</span>
              <span style={{ padding: '2px 8px', background: '#f4f4f5', borderRadius: '3px', fontSize: '12px' }}>Executive Leadership</span>
              <span style={{ padding: '2px 8px', background: '#f4f4f5', borderRadius: '3px', fontSize: '12px' }}>TypeScript / Node.js</span>
            </div>
          )}
        </Section>
      )}

      {/* Projects */}
      {hasProjects && (
        <Section title="Selected Projects" isHighlighted={activeSection === 'additional'}>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#09090b' }}>{proj.name}</span>
                {proj.url && <span style={{ color: '#71717a', fontSize: '12px' }}>{proj.url}</span>}
              </div>
              {proj.technologies.length > 0 && (
                <p style={{ color: '#71717a', margin: '3px 0', fontSize: '12px' }}>
                  {proj.technologies.join(' · ')}
                </p>
              )}
              {proj.description && <p style={{ color: '#3f3f46', margin: '4px 0 0 0', fontSize: '13px', lineHeight: '1.55' }}>{proj.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {hasCerts && (
        <Section title="Certifications" isHighlighted={activeSection === 'additional'}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontWeight: '600', fontSize: '13.5px' }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: '#71717a', fontSize: '13px' }}> — {cert.issuer}</span>}
              </div>
              <span style={{ color: '#71717a', fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}>{cert.date}</span>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        <h2
          style={{
            fontSize: '12px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#18181b',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e4e4e7' }} />
      </div>
      {children}
    </section>
  );
}
