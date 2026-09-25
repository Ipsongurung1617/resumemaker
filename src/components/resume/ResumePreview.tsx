'use client';

import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import { ResumeData, ResumeTemplate } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
  id?: string;
  scale?: number;
  hideProtection?: boolean;
  activeSection?: string;
  onDownloadClick?: () => void;
}

export default function ResumePreview({
  data,
  template,
  id = 'resume-preview',
  scale = 0.62,
  hideProtection = false,
  activeSection,
  onDownloadClick,
}: ResumePreviewProps) {
  const TemplateComponent =
    template === 'classic' ? ClassicTemplate :
    template === 'minimal' ? MinimalTemplate :
    ModernTemplate;

  const currentScale = scale || 1;
  const scaledWidth = Math.round(794 * currentScale);
  const scaledHeight = Math.round(1123 * currentScale);

  return (
    <div
      className="relative select-none unselectable-preview mx-auto transition-all duration-200 ease-in-out"
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '794px',
          minHeight: '1123px',
          transform: `scale(${currentScale})`,
          transformOrigin: 'top left',
        }}
      >
        <div
          id={id}
          className="relative bg-white overflow-hidden rounded-[2px]"
          style={{
            width: '794px',
            minHeight: '1123px',
            border: '1px solid rgba(26, 26, 22, 0.12)',
            boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
          }}
        >
          {/* Render Active Editorial Template */}
          <TemplateComponent data={data} activeSection={activeSection} />

          {/* Anti-Screenshot Bottom Shield: Bar in --ink, text in --paper, button in --accent */}
          {!hideProtection && (
            <div
              className="preview-protection-overlay protection-shield absolute bottom-0 left-0 right-0 h-40 flex flex-col items-center justify-end pb-8 px-6 text-center select-none"
              style={{
                background: 'linear-gradient(to top, rgba(253,252,249,1) 0%, rgba(253,252,249,0.92) 50%, rgba(253,252,249,0) 100%)',
              }}
            >
              <div
                className="px-5 py-3 rounded-[8px] flex items-center gap-4 text-left"
                style={{
                  backgroundColor: '#1A1A16',
                  color: '#FDFCF9',
                  border: '1px solid rgba(253, 252, 249, 0.12)',
                  boxShadow: '0 1px 3px rgba(26, 26, 22, 0.08)',
                }}
              >
                <div>
                  <div className="font-semibold text-xs" style={{ color: '#FDFCF9' }}>
                    Draft Preview Active
                  </div>
                  <div className="text-[11px]" style={{ color: 'rgba(253, 252, 249, 0.55)' }}>
                    Export to generate official unwatermarked PDF
                  </div>
                </div>

                {onDownloadClick && (
                  <button
                    type="button"
                    onClick={onDownloadClick}
                    className="ml-2 text-xs font-semibold px-3.5 py-2 rounded-[8px] transition-opacity hover:opacity-90 shrink-0"
                    style={{
                      backgroundColor: '#2F5D3A',
                      color: '#FDFCF9',
                    }}
                  >
                    Export PDF
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
