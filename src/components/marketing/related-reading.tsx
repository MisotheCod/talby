import Link from "next/link";

/** Related-reading block for blog posts: internal links to sibling articles.
 *  Improves crawl (deep links into the cluster) and keeps readers on site.
 *  Rendered before the closing CTA on every post. */
export function RelatedReading({
  links,
}: {
  links: { href: string; title: string }[];
}) {
  if (!links.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold tracking-tight">Keep reading</h2>
      <ul className="list-disc text-muted text-base leading-relaxed pl-5 space-y-1.5 mt-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:underline underline-offset-2">
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}