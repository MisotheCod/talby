import { notFound } from 'next/navigation';
import * as Boards from '@/components/talby/_index';

export default function Page() {
  if (process.env.NODE_ENV === 'production' && process.env.TALBY_PREVIEW !== '1') notFound();
  const names = Object.keys(Boards).sort();
  return (
    <main style={{ padding: 32, fontFamily: 'system-ui', columns: 4 }}>
      {names.map((n) => (
        <div key={n}><a href={`/talby-preview/${n}`}>{n}</a></div>
      ))}
    </main>
  );
}
