'use client';

export async function generatePDF(elementId: string, filename: string): Promise<void> {
  const html2canvas = (await import('html2canvas')).default;
  const jsPDF = (await import('jspdf')).default;

  const original = document.getElementById(elementId);
  if (!original) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Clone element to an offscreen unscaled container to ensure pristine 1:1 render
  const clone = original.cloneNode(true) as HTMLElement;

  // Remove any UI overlays, watermarks, and anti-screenshot shields from the export clone
  const elementsToRemove = clone.querySelectorAll<HTMLElement>(
    '.preview-protection-overlay, .preview-watermark, .protection-shield'
  );
  elementsToRemove.forEach(el => el.remove());

  // Remove active editing outlines / amber highlight boxes from the export clone
  const allElements = clone.querySelectorAll<HTMLElement>('*');
  allElements.forEach(el => {
    if (
      el.style.border?.includes('#f59e0b') ||
      el.style.border?.includes('rgb(245, 158, 11)') ||
      el.style.outline?.includes('#f59e0b')
    ) {
      el.style.border = '2px solid transparent';
      el.style.outline = 'none';
      if (
        el.style.backgroundColor?.includes('rgba(254, 243, 199') ||
        el.style.backgroundColor?.includes('rgba(245, 158, 11')
      ) {
        el.style.backgroundColor = 'transparent';
      }
    }
  });

  // Position clone completely unscaled off-screen
  clone.style.position = 'fixed';
  clone.style.left = '-10000px';
  clone.style.top = '0';
  clone.style.width = '794px';
  clone.style.transform = 'none';
  clone.style.zIndex = '-9999';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  document.body.appendChild(clone);

  try {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution (300 DPI retina)
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      height: Math.max(clone.scrollHeight, 1123),
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdfWidth = 210; // A4 mm
    const pdfHeight = 297; // A4 mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let position = 0;
    let remainingHeight = imgHeight;

    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight, undefined, 'FAST');
      remainingHeight -= pdfHeight;
      position += pdfHeight;
      if (remainingHeight > 2) {
        pdf.addPage();
      }
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}

