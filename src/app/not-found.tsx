import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-5xl font-semibold tracking-tight">404</h1>
      <p className="text-muted mt-3 text-lg">This page wandered off.</p>
      <div className="flex gap-3 mt-8">
        <Link href="/" className="px-5 h-10 inline-flex items-center rounded-lg accent-fill font-semibold text-sm">Back to home</Link>
      </div>
    </div>
  );
}
