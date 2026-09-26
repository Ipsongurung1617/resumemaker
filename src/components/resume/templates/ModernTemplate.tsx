import type { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  activeSection?: string;
}

export default function ModernTemplate({ data, activeSection }: Props) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = data;

  return (
    <div
      className="bg-white text-slate-900 font-sans"
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        color: '#1A1A16',
      }}
    >
      {/* Editorial Header — Styled in Deep Ink & Forest Accent */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A16 0%, #243D2A 100%)',
          padding: '34px 44px',
          outline: activeSection === 'header' ? '2px solid #2F5D3A' : 'none',
          outlineOffset: '2px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#FDFCF9',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          {personalInfo.name || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
          {personalInfo.email && (
            <span style={{ color: '#D2E3D6', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ✉ {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span style={{ color: '#D2E3D6', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📱 {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span style={{ color: '#D2E3D6', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📍 {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span style={{ color: '#D2E3D6', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🔗 {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span style={{ color: '#D2E3D6', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              💻 {personalInfo.github}
            </span>
          )}
          {personalInfo.website && (
            <span style={{ color: '#D2E3D6', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🌐 {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      {/* Body Canvas */}
      <div style={{ padding: '30px 44px' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <Section title="Professional Summary" isHighlighted={activeSection === 'summary'}>
            <p style={{ fontSize: '13px', lineHeight: '1.65', color: 'rgba(26, 26, 22, 0.78)', margin: 0 }}>
              {personalInfo.summary}
            </p>
          </Section>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <Section title="Work Experience" isHighlighted={activeSection === 'experience'}>
            {workExperience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#1A1A16' }}>{exp.title}</div>
                    <div style={{ fontSize: '13px', color: '#2F5D3A', fontWeight: 600, marginTop: '1px' }}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(26, 26, 22, 0.55)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px' }}>
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} style={{ fontSize: '13px', color: 'rgba(26, 26, 22, 0.75)', lineHeight: '1.6', marginBottom: '4px' }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education" isHighlighted={activeSection === 'education'}>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A16' }}>{edu.degree}</div>
                  <div style={{ fontSize: '13px', color: '#2F5D3A', fontWeight: 600 }}>
                    {edu.school}{edu.location ? ` · ${edu.location}` : ''}
                  </div>
                  {edu.gpa && <div style={{ fontSize: '12px', color: 'rgba(26, 26, 22, 0.55)' }}>GPA: {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(26, 26, 22, 0.55)', whiteSpace: 'nowrap' }}>
                  {formatDate(edu.graduationDate)}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.some((g) => g.items.length > 0) && (
          <Section title="Skills & Competencies" isHighlighted={activeSection === 'skills'}>
            {skills.filter((g) => g.items.length > 0).map((group) => (
              <div key={group.category} style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A16', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {group.category}:&nbsp;
                </span>
                <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px' }}>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        background: 'rgba(47, 93, 58, 0.08)',
                        color: '#2F5D3A',
                        border: '1px solid rgba(47, 93, 58, 0.22)',
                        borderRadius: '999px',
                        padding: '2px 10px',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects" isHighlighted={activeSection === 'projects'}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A16' }}>{proj.name}</span>
                  {proj.url && (
                    <span style={{ fontSize: '12px', color: '#2F5D3A', fontWeight: 500 }}>{proj.url}</span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(26, 26, 22, 0.75)', margin: '4px 0', lineHeight: '1.6' }}>
                  {proj.description}
                </p>
                {proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          background: 'rgba(26, 26, 22, 0.05)',
                          color: 'rgba(26, 26, 22, 0.65)',
                          borderRadius: '4px',
                          padding: '2px 8px',
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
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications" isHighlighted={activeSection === 'certifications'}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: '#1A1A16' }}>{cert.name}</span>
                  <span style={{ color: '#2F5D3A', fontSize: '13px', fontWeight: 500 }}> — {cert.issuer}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(26, 26, 22, 0.55)' }}>{formatDate(cert.date)}</span>
              </div>
            ))}
          </Section>
        )}
      </div>
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
    <div
      style={{
        marginBottom: '22px',
        borderRadius: '6px',
        padding: isHighlighted ? '8px' : '0',
        backgroundColor: isHighlighted ? 'rgba(47, 93, 58, 0.06)' : 'transparent',
        transition: 'background-color 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '13.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2F5D3A', margin: 0 }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(to right, #2F5D3A, rgba(47, 93, 58, 0.15))', borderRadius: '999px' }} />
      </div>
      {children}
    </div>
  );
}
