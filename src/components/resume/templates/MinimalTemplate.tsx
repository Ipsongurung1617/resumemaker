'use client';

import { ResumeData } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
  activeSection?: string;
}

export default function MinimalTemplate({ data, activeSection }: TemplateProps) {
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
        fontFamily: '"SF Mono", "JetBrains Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace',
        fontSize: '12px',
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
      {/* Tech Mono Terminal Header */}
      <header
        style={{
          border: '1px solid #18181b',
          padding: '24px 28px',
          marginBottom: '28px',
          outline: activeSection === 'header' ? '1px solid #2F5D3A' : 'none',
          backgroundColor: activeSection === 'header' ? 'rgba(47, 93, 58, 0.08)' : '#fafafa',
          outlineOffset: '4px',
          borderRadius: '4px',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              margin: 0,
              color: hasName ? '#09090b' : '#a1a1aa',
            }}
          >
            {hasName ? pi.name : 'DEV::ALEX_CHEN'}
          </h1>
          <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            STATUS: ACTIVE / ATS_VERIFIED
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 16px',
            fontSize: '11.5px',
            color: hasContact ? '#3f3f46' : '#a1a1aa',
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px dashed #d4d4d8',
          }}
        >
          {pi.email ? <span>[email: {pi.email}]</span> : !hasContact && <span>[email: alex@syseng.io]</span>}
          {pi.phone && <span>[tel: {pi.phone}]</span>}
          {pi.location && <span>[loc: {pi.location}]</span>}
          {pi.github && <span>[gh: {pi.github}]</span>}
          {pi.linkedin && <span>[in: {pi.linkedin}]</span>}
          {pi.website && <span>[web: {pi.website}]</span>}
        </div>
      </header>

      {/* Summary */}
      {(hasSummary || (!hasExp && !hasEdu)) && (
        <MonoSection title="// 01. PROFILE_MANIFEST" isHighlighted={activeSection === 'summary'}>
          <p
            style={{
              margin: 0,
              color: hasSummary ? '#27272a' : '#a1a1aa',
              fontSize: '12px',
              lineHeight: '1.65',
              fontStyle: hasSummary ? 'normal' : 'italic',
            }}
          >
            {hasSummary
              ? pi.summary
              : 'Systems architect specializing in distributed consensus protocols, high-frequency transactional data streams, and kernel-level performance tuning. 8+ years designing zero-downtime distributed backends.'}
          </p>
        </MonoSection>
      )}

      {/* Work Experience */}
      {(hasExp || !hasEdu) && (
        <MonoSection title="// 02. WORK_HISTORY" isHighlighted={activeSection === 'experience'}>
          {hasExp ? (
            workExperience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '13px', color: '#09090b' }}>{exp.title || 'ROLE'}</span>
                    <span style={{ color: '#52525b', marginLeft: '6px' }}>
                      @ {exp.company || 'ORGANIZATION'}{exp.location ? ` [${exp.location}]` : ''}
                    </span>
                  </div>
                  <span style={{ color: '#71717a', fontSize: '11px', whiteSpace: 'nowrap' }}>
                    [{exp.startDate || '2021'} -&gt; {exp.current ? 'NOW' : exp.endDate || '2024'}]
                  </span>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ margin: '8px 0 0 20px', padding: 0, listStyleType: 'square' }}>
                    {exp.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: '5px', color: '#27272a', fontSize: '12px', lineHeight: '1.6' }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div style={{ color: '#a1a1aa', fontStyle: 'italic', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700' }}>PRINCIPAL DISTRIBUTED SYSTEMS ARCHITECT @ NEXUSTECH</span>
                <span>[2021 -&gt; NOW]</span>
              </div>
              <ul style={{ margin: '6px 0 0 18px', padding: 0, listStyleType: 'square' }}>
                <li>Rewrote global event mesh from Java to Rust, reducing p99 tail latency from 85ms to 3.2ms.</li>
                <li>Orchestrated multi-region active-active failover with Raft consensus.</li>
              </ul>
            </div>
          )}
        </MonoSection>
      )}

      {/* Skills */}
      {(hasSkills || (!hasExp && !hasEdu)) && (
        <MonoSection title="// 03. TECH_STACK &amp; COMPETENCIES" isHighlighted={activeSection === 'skills'}>
          {hasSkills ? (
            skills.map((group, i) => (
              <div key={i} style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', color: '#18181b', minWidth: '150px', fontSize: '11.5px' }}>
                  {group.category}::
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {group.items.map((item, j) => (
                    <span
                      key={j}
                      style={{
                        backgroundColor: '#f4f4f5',
                        border: '1px solid #e4e4e7',
                        padding: '1px 6px',
                        borderRadius: '2px',
                        fontSize: '11px',
                        color: '#18181b',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', color: '#a1a1aa' }}>
              <span style={{ padding: '1px 6px', background: '#f4f4f5', border: '1px solid #e4e4e7' }}>Rust</span>
              <span style={{ padding: '1px 6px', background: '#f4f4f5', border: '1px solid #e4e4e7' }}>Go</span>
              <span style={{ padding: '1px 6px', background: '#f4f4f5', border: '1px solid #e4e4e7' }}>Kubernetes</span>
              <span style={{ padding: '1px 6px', background: '#f4f4f5', border: '1px solid #e4e4e7' }}>PostgreSQL</span>
              <span style={{ padding: '1px 6px', background: '#f4f4f5', border: '1px solid #e4e4e7' }}>eBPF</span>
            </div>
          )}
        </MonoSection>
      )}

      {/* Education */}
      {(hasEdu || !hasExp) && (
        <MonoSection title="// 04. ACADEMIC_CREDENTIALS" isHighlighted={activeSection === 'education'}>
          {hasEdu ? (
            education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '12.5px', color: '#09090b' }}>{edu.degree || 'DEGREE'}</span>
                  <span style={{ color: '#52525b', marginLeft: '6px' }}>
                    :: {edu.school || 'INSTITUTION'}{edu.location ? ` [${edu.location}]` : ''}
                  </span>
                  {edu.gpa && <span style={{ color: '#71717a', marginLeft: '6px' }}> (GPA: {edu.gpa})</span>}
                </div>
                <span style={{ color: '#71717a', fontSize: '11px' }}>[{edu.graduationDate || '2020'}]</span>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontStyle: 'italic' }}>
              <div>B.S. COMPUTER ENGINEERING :: MIT [CAMBRIDGE, MA]</div>
              <span>[2016 -&gt; 2020]</span>
            </div>
          )}
        </MonoSection>
      )}

      {/* Projects */}
      {hasProjects && (
        <MonoSection title="// 05. REPOSITORIES &amp; OSS" isHighlighted={activeSection === 'additional'}>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', fontSize: '12.5px', color: '#09090b' }}>&gt; {proj.name}</span>
                {proj.url && <span style={{ color: '#71717a', fontSize: '11px' }}>{proj.url}</span>}
              </div>
              {proj.technologies.length > 0 && (
                <p style={{ color: '#71717a', margin: '2px 0', fontSize: '11px' }}>
                  stack: {proj.technologies.join(', ')}
                </p>
              )}
              {proj.description && <p style={{ color: '#3f3f46', margin: '3px 0 0 0', fontSize: '12px' }}>{proj.description}</p>}
            </div>
          ))}
        </MonoSection>
      )}

      {/* Certifications */}
      {hasCerts && (
        <MonoSection title="// 06. CERTIFICATIONS" isHighlighted={activeSection === 'additional'}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'baseline' }}>
              <span>
                <span style={{ fontWeight: '700' }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: '#71717a' }}> :: {cert.issuer}</span>}
              </span>
              <span style={{ color: '#71717a', fontSize: '11px' }}>[{cert.date}]</span>
            </div>
          ))}
        </MonoSection>
      )}
    </div>
  );
}

function MonoSection({
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
        marginBottom: '22px',
        border: isHighlighted ? '1px solid #2F5D3A' : '1px solid transparent',
        borderRadius: '4px',
        padding: isHighlighted ? '8px 10px' : '0',
        backgroundColor: isHighlighted ? 'rgba(47, 93, 58, 0.08)' : 'transparent',
        transition: 'all 0.15s ease',
      }}
    >
      <div
        style={{
          fontSize: '11.5px',
          fontWeight: '800',
          letterSpacing: '0.04em',
          color: '#18181b',
          borderBottom: '1px solid #18181b',
          paddingBottom: '4px',
          marginBottom: '10px',
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}
