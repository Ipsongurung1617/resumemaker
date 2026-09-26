import type { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface Props {
  data: ResumeData;
  activeSection?: string;
}

export default function ClassicTemplate({ data, activeSection }: Props) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = data;

  return (
    <div
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: '40px 48px',
        background: '#fff',
        color: '#111',
        fontFamily: 'Georgia, "Times New Roman", serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          outline: activeSection === 'header' ? '2px solid #111' : 'none',
          padding: '8px',
          borderRadius: '4px',
        }}
      >
        <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '0.03em', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#444' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>|</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>|</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '2px solid #111', margin: '0 0 20px 0' }} />

      {/* Summary */}
      {personalInfo.summary && (
        <ClassicSection title="Professional Summary" isHighlighted={activeSection === 'summary'}>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#333', margin: 0 }}>
            {personalInfo.summary}
          </p>
        </ClassicSection>
      )}

      {/* Experience */}
      {workExperience.length > 0 && (
        <ClassicSection title="Work Experience" isHighlighted={activeSection === 'experience'}>
          {workExperience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{exp.title}</span>
                  <span style={{ fontStyle: 'italic', color: '#444', fontSize: '13px' }}>
                    {' '}— {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
                  {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px' }}>
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#333', lineHeight: '1.6', marginBottom: '3px' }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <ClassicSection title="Education" isHighlighted={activeSection === 'education'}>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{edu.degree}</span>
                <span style={{ fontStyle: 'italic', color: '#444', fontSize: '13px' }}>
                  {' '}— {edu.school}{edu.location ? `, ${edu.location}` : ''}
                </span>
                {edu.gpa && <span style={{ fontSize: '12px', color: '#666' }}> · GPA: {edu.gpa}</span>}
              </div>
              <span style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
                {formatDate(edu.graduationDate)}
              </span>
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Skills */}
      {skills.some((g) => g.items.length > 0) && (
        <ClassicSection title="Skills" isHighlighted={activeSection === 'skills'}>
          {skills.filter((g) => g.items.length > 0).map((group) => (
            <div key={group.category} style={{ marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ fontWeight: 700 }}>{group.category}: </span>
              <span style={{ color: '#333' }}>{group.items.join(', ')}</span>
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <ClassicSection title="Projects" isHighlighted={activeSection === 'projects'}>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>
                {proj.name}
                {proj.url && <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#555', fontSize: '12px' }}> — {proj.url}</span>}
              </div>
              <p style={{ fontSize: '13px', color: '#333', margin: '3px 0', lineHeight: '1.6' }}>{proj.description}</p>
              {proj.technologies.length > 0 && (
                <div style={{ fontSize: '12px', color: '#555' }}>
                  <span style={{ fontWeight: 600 }}>Technologies: </span>
                  {proj.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </ClassicSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <ClassicSection title="Certifications" isHighlighted={activeSection === 'certifications'}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span>
                <span style={{ fontWeight: 600 }}>{cert.name}</span> — {cert.issuer}
              </span>
              <span style={{ color: '#666', fontSize: '12px' }}>{formatDate(cert.date)}</span>
            </div>
          ))}
        </ClassicSection>
      )}
    </div>
  );
}

function ClassicSection({
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
        marginBottom: '20px',
        padding: isHighlighted ? '8px' : '0',
        backgroundColor: isHighlighted ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
        borderRadius: '4px',
      }}
    >
      <h2
        style={{
          fontSize: '14px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#111',
          borderBottom: '1px solid #111',
          paddingBottom: '4px',
          marginBottom: '10px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
