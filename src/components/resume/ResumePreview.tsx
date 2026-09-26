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
  isPro?: boolean;
}

export default function ResumePreview({
  data,
  template,
  id = 'resume-preview',
  scale = 0.62,
  hideProtection = false,
  activeSection,
  onDownloadClick,
  isPro = false,
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
          {/* Resume template content */}
          <TemplateComponent data={data} activeSection={activeSection} />

          {/* ── FREE PLAN DIAGONAL WATERMARK ── */}
          {/* Renders on top of resume content so screenshots are also watermarked */}
          {!isPro && (
            <div
              aria-hidden="true"
              className="preview-watermark"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 10,
                overflow: 'hidden',
              }}
            >
              {/* Diagonal repeating watermark grid */}
              {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 5 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    style={{
                      position: 'absolute',
                      top: `${row * 160 - 40}px`,
                      left: `${col * 220 - 60}px`,
                      transform: 'rotate(-35deg)',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: 'rgba(47, 93, 58, 0.13)',
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    ATSRESUMEBUILDER.COM · FREE
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── BOTTOM SHIELD BAR ── */}
          {!hideProtection && (
            <div
              className="preview-protection-overlay protection-shield absolute bottom-0 left-0 right-0 h-40 flex flex-col items-center justify-end pb-8 px-6 text-center select-none"
              style={{
                background: 'linear-gradient(to top, rgba(253,252,249,1) 0%, rgba(253,252,249,0.92) 50%, rgba(253,252,249,0) 100%)',
                zIndex: 20,
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
                    {isPro ? 'Pro Preview Active' : 'Free Plan Preview'}
                  </div>
                  <div className="text-[11px]" style={{ color: 'rgba(253, 252, 249, 0.55)' }}>
                    {isPro
                      ? 'Export to generate clean PDF'
                      : 'Upgrade to Pro to remove watermark & export PDF'}
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
                    {isPro ? 'Export PDF' : 'Upgrade →'}
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
