'use client';

import { useState } from 'react';

export default function ProBadge({ tooltip = 'Upgrade to Pro to unlock' }: { tooltip?: string }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="badge-pro cursor-help select-none">
        ⚡ PRO
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 text-center shadow-lg z-50 pointer-events-none">
          {tooltip}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
}
