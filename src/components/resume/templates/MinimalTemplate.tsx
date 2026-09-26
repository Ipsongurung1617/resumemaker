import type { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  activeSection?: string;
}

export default function MinimalTemplate({ data, activeSection }: Props) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = data;

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        display: 'flex',
        background: '#fff',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Sidebar */}
      <div
        style={{
          width: '240px',
          background: '#0F172A',
          color: '#E2E8F0',
          padding: '32px 20px',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Name */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px 0', lineHeight: '1.2' }}>
            {personalInfo.name || 'Your Name'}
          </h1>
        </div>

        {/* Contact */}
        <SideSection title="Contact">
          {personalInfo.email && <SideItem icon="✉" text={personalInfo.email} />}
          {personalInfo.phone && <SideItem icon="📱" text={personalInfo.phone} />}
          {personalInfo.location && <SideItem icon="📍" text={personalInfo.location} />}
          {personalInfo.linkedin && <SideItem icon="in" text={personalInfo.linkedin} />}
          {personalInfo.github && <SideItem icon="⌨" text={personalInfo.github} />}
          {personalInfo.website && <SideItem icon="🌐" text={personalInfo.website} />}
        </SideSection>

        {/* Skills */}
        {skills.some((g) => g.items.length > 0) && (
          <SideSection title="Skills">
            {skills.filter((g) => g.items.length > 0).map((group) => (
              <div key={group.category} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: '5px' }}>
                  {group.category}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        color: '#E2E8F0',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#F1F5F9' }}>{cert.name}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{cert.issuer}</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>{formatDate(cert.date)}</div>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Right Main Content */}
      <div style={{ flex: 1, padding: '32px 28px', boxSizing: 'border-box' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <MainSection title="About Me" isHighlighted={activeSection === 'summary'}>
            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#475569', margin: 0 }}>
              {personalInfo.summary}
            </p>
          </MainSection>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <MainSection title="Experience" isHighlighted={activeSection === 'experience'}>
            {workExperience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{exp.title}</div>
                    <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600 }}>
                      {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)}<br />
                    {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px' }}>
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '3px' }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <MainSection title="Education" isHighlighted={activeSection === 'education'}>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>{edu.degree}</div>
                  <div style={{ fontSize: '12px', color: '#7C3AED' }}>
                    {edu.school}{edu.location ? ` — ${edu.location}` : ''}
                  </div>
                  {edu.gpa && <div style={{ fontSize: '11px', color: '#94A3B8' }}>GPA: {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                  {formatDate(edu.graduationDate)}
                </div>
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects" isHighlighted={activeSection === 'projects'}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
                  {proj.name}
                  {proj.url && <span style={{ fontWeight: 400, fontSize: '11px', color: '#7C3AED', marginLeft: '8px' }}>{proj.url}</span>}
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: '3px 0', lineHeight: '1.6' }}>
                  {proj.description}
                </p>
                {proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          background: '#F3F4F6',
                          color: '#6B7280',
                          borderRadius: '4px',
                          padding: '1px 6px',
                          fontSize: '11px',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#7C3AED',
          borderBottom: '1px solid rgba(124,58,237,0.4)',
          paddingBottom: '4px',
          marginBottom: '10px',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SideItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '5px' }}>
      <span style={{ fontSize: '11px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <span style={{ fontSize: '11px', color: '#CBD5E1', wordBreak: 'break-all' }}>{text}</span>
    </div>
  );
}

function MainSection({
  title,
  children,
  isHighlighted,
}: {
  title: string;
  children: React.ReactNode;
  isHighlighted?: boolean;
}) {
  return (
    <div
      style={{
        marginBottom: '22px',
        borderRadius: '6px',
        padding: isHighlighted ? '8px' : '0',
        backgroundColor: isHighlighted ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0F172A', margin: 0 }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
      </div>
      {children}
    </div>
  );
}
