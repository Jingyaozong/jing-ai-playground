export function PageIntro({ eyebrow, title, description, count }: { eyebrow: string; title: string; description: string; count?: string }) {
  return (
    <section className="page-intro">
      <div className="page-intro-top mono"><span>{eyebrow}</span><span>{count ?? ''}</span></div>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
