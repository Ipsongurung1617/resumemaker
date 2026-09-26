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
        background: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Sidebar — Styled in Website Deep Ink #1A1A16 */}
      <div
        style={{
          width: '240px',
          background: '#1A1A16',
          color: '#FDFCF9',
          padding: '34px 22px',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Name */}
        <div style={{ marginBottom: '26px' }}>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#FDFCF9',
              margin: '0 0 4px 0',
              lineHeight: '1.2',
              letterSpacing: '-0.01em',
            }}
          >
            {personalInfo.name || 'Your Name'}
          </h1>
        </div>

        {/* Contact */}
        <SideSection title="Contact">
          {personalInfo.email && <SideItem icon="✉" text={personalInfo.email} />}
          {personalInfo.phone && <SideItem icon="📱" text={personalInfo.phone} />}
          {personalInfo.location && <SideItem icon="📍" text={personalInfo.location} />}
          {personalInfo.linkedin && <SideItem icon="in" text={personalInfo.linkedin} />}
          {personalInfo.github && <SideItem icon="💻" text={personalInfo.github} />}
          {personalInfo.website && <SideItem icon="🌐" text={personalInfo.website} />}
        </SideSection>

        {/* Skills */}
        {skills.some((g) => g.items.length > 0) && (
          <SideSection title="Skills & Competencies">
            {skills.filter((g) => g.items.length > 0).map((group) => (
              <div key={group.category} style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A3D9B1', marginBottom: '5px', fontWeight: 700 }}>
                  {group.category}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        background: 'rgba(253, 252, 249, 0.1)',
                        border: '1px solid rgba(253, 252, 249, 0.14)',
                        borderRadius: '4px',
                        padding: '2px 7px',
                        fontSize: '11px',
                        color: '#FDFCF9',
                        fontWeight: 500,
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
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FDFCF9' }}>{cert.name}</div>
                <div style={{ fontSize: '11px', color: '#A3D9B1' }}>{cert.issuer}</div>
                <div style={{ fontSize: '10px', color: 'rgba(253, 252, 249, 0.55)' }}>{formatDate(cert.date)}</div>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Right Main Content */}
      <div style={{ flex: 1, padding: '34px 32px', boxSizing: 'border-box' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <MainSection title="About Me" isHighlighted={activeSection === 'summary'}>
            <p style={{ fontSize: '13px', lineHeight: '1.65', color: 'rgba(26, 26, 22, 0.8)', margin: 0 }}>
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
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A16' }}>{exp.title}</div>
                    <div style={{ fontSize: '13px', color: '#2F5D3A', fontWeight: 600 }}>
                      {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(26, 26, 22, 0.55)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)}<br />
                    {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px' }}>
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} style={{ fontSize: '12.5px', color: 'rgba(26, 26, 22, 0.75)', lineHeight: '1.6', marginBottom: '3px' }}>
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
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1A1A16' }}>{edu.degree}</div>
                  <div style={{ fontSize: '12px', color: '#2F5D3A', fontWeight: 600 }}>
                    {edu.school}{edu.location ? ` — ${edu.location}` : ''}
                  </div>
                  {edu.gpa && <div style={{ fontSize: '11px', color: 'rgba(26, 26, 22, 0.55)' }}>GPA: {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(26, 26, 22, 0.55)', whiteSpace: 'nowrap' }}>
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
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#1A1A16' }}>
                  {proj.name}
                  {proj.url && <span style={{ fontWeight: 500, fontSize: '11px', color: '#2F5D3A', marginLeft: '8px' }}>{proj.url}</span>}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(26, 26, 22, 0.75)', margin: '3px 0', lineHeight: '1.6' }}>
                  {proj.description}
                </p>
                {proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          background: 'rgba(26, 26, 22, 0.05)',
                          color: 'rgba(26, 26, 22, 0.7)',
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
    <div style={{ marginBottom: '22px' }}>
      <div
        style={{
          fontSize: '10.5px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#A3D9B1',
          borderBottom: '1px solid rgba(163, 217, 177, 0.25)',
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
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', marginBottom: '6px' }}>
      <span style={{ fontSize: '11px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <span style={{ fontSize: '11px', color: 'rgba(253, 252, 249, 0.85)', wordBreak: 'break-all' }}>{text}</span>
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
        backgroundColor: isHighlighted ? 'rgba(47, 93, 58, 0.05)' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1A1A16', margin: 0 }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '1px', background: 'rgba(26, 26, 22, 0.12)' }} />
      </div>
      {children}
    </div>
  );
}
