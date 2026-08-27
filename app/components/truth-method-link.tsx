import Link from 'next/link';

export function TruthMethodLink() {
  return (
    <Link className="truth-method-link mono" href="/notes/draft-pilot-conclusion/">
      为什么这样标记 <span aria-hidden="true">↗</span>
    </Link>
  );
}
