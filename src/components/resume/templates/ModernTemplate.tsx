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
      style={{ width: '794px', minHeight: '1123px', padding: 0, boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
          padding: '32px 40px',
          outline: activeSection === 'header' ? '2px solid #2563EB' : 'none',
          outlineOffset: '2px',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0 }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
          {personalInfo.email && (
            <span style={{ color: '#dbeafe', fontSize: '13px' }}>✉ {personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span style={{ color: '#dbeafe', fontSize: '13px' }}>📱 {personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span style={{ color: '#dbeafe', fontSize: '13px' }}>📍 {personalInfo.location}</span>
          )}
          {personalInfo.linkedin && (
            <span style={{ color: '#dbeafe', fontSize: '13px' }}>🔗 {personalInfo.linkedin}</span>
          )}
          {personalInfo.github && (
            <span style={{ color: '#dbeafe', fontSize: '13px' }}>💻 {personalInfo.github}</span>
          )}
          {personalInfo.website && (
            <span style={{ color: '#dbeafe', fontSize: '13px' }}>🌐 {personalInfo.website}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 40px' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <Section title="Summary" isHighlighted={activeSection === 'summary'}>
            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#475569', margin: 0 }}>
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
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{exp.title}</div>
                    <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 600 }}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px' }}>
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '4px' }}>
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
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{edu.degree}</div>
                  <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 600 }}>
                    {edu.school}{edu.location ? ` · ${edu.location}` : ''}
                  </div>
                  {edu.gpa && <div style={{ fontSize: '12px', color: '#64748b' }}>GPA: {edu.gpa}</div>}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {formatDate(edu.graduationDate)}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.some((g) => g.items.length > 0) && (
          <Section title="Skills" isHighlighted={activeSection === 'skills'}>
            {skills.filter((g) => g.items.length > 0).map((group) => (
              <div key={group.category} style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {group.category}:&nbsp;
                </span>
                <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px' }}>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        background: '#EFF6FF',
                        color: '#2563EB',
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
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{proj.name}</span>
                  {proj.url && (
                    <span style={{ fontSize: '12px', color: '#2563EB' }}>{proj.url}</span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0', lineHeight: '1.6' }}>
                  {proj.description}
                </p>
                {proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          background: '#F1F5F9',
                          color: '#64748B',
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
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{cert.name}</span>
                  <span style={{ color: '#64748b', fontSize: '13px' }}> — {cert.issuer}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{formatDate(cert.date)}</span>
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
        backgroundColor: isHighlighted ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
        transition: 'background-color 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB', margin: 0 }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to right, #2563EB, #7C3AED)', borderRadius: '999px' }} />
      </div>
      {children}
    </div>
  );
}
