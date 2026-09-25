import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">Error 404</p>
      <h1 className="text-3xl font-serif text-zinc-900 mb-4">Document Not Found</h1>
      <p className="text-sm text-zinc-500 max-w-md mb-8">
        The page or resume you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
