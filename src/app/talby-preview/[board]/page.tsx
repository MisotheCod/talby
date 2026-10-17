import { notFound } from 'next/navigation';
import TalbyPreview from '@/components/talby-preview/TalbyPreview';

// Preview of every converted board, for parity checks. Only on preview builds.
export default async function Page({ params, searchParams }: { params: Promise<{ board: string }>; searchParams: Promise<{ props?: string }> }) {
  if (process.env.NODE_ENV === 'production' && process.env.TALBY_PREVIEW !== '1') notFound();
  const { board } = await params;
  const { props } = await searchParams;
  let parsed: Record<string, unknown> = {};
  try { parsed = props ? JSON.parse(props) : {}; } catch {}
  return <TalbyPreview board={board} props={parsed} />;
}
