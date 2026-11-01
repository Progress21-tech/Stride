'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

export type LegalSectionData = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageLayoutProps = {
  title: string;
  description: string;
  sections: LegalSectionData[];
};

function LegalTableOfContents({ sections, activeId }: { sections: LegalSectionData[]; activeId: string }) {
  const links = sections.map((section, index) => <a key={section.id} href={`#${section.id}`} aria-current={activeId === section.id ? 'location' : undefined} className="legal-toc-link"><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>);

  return <>
    <details className="legal-mobile-toc">
      <summary>On this page</summary>
      <nav aria-label="On this page">{links}</nav>
    </details>
    <aside className="legal-desktop-toc" aria-label="Table of contents">
      <p className="legal-toc-heading">On this page</p>
      <nav>{links}</nav>
    </aside>
  </>;
}

export function LegalPageLayout({ title, description, sections }: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const targets = sections.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => node !== null);
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveId(visible[0].target.id);
    }, { rootMargin: '-12% 0px -72% 0px', threshold: 0 });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sections]);

  return <div className="legal-page">
    <header className="legal-header">
      <div className="legal-header-inner"><Link href="/" className="legal-brand" aria-label="Sylpace home">SYLP<span>A</span>CE</Link><Link href="/" className="legal-back">Back to Sylpace <span aria-hidden="true">↗</span></Link></div>
    </header>

    <main className="legal-main">
      <div className="legal-title-block">
        <p className="legal-kicker">Sylpace · Legal</p>
        <h1>{title}</h1>
        <p className="legal-description">{description}</p>
        <div className="legal-dates"><span><strong>Effective date:</strong> [EFFECTIVE DATE TO BE CONFIRMED]</span><span><strong>Last updated:</strong> 1 November 2026</span></div>
        <aside className="legal-draft-notice" aria-label="Draft status">
          <span className="legal-draft-label">DRAFT: REQUIRES LEGAL REVIEW</span>
          <p>This document is a draft and has not been approved as final legal advice. Sylpace’s owner and qualified legal counsel must review it before public launch.</p>
        </aside>
      </div>

      <div className="legal-grid">
        <article className="legal-document" aria-label={title}>
          {sections.map((section, index) => <section key={section.id} id={section.id} className="legal-section" aria-labelledby={`${section.id}-heading`}>
            <p className="legal-section-number">{String(index + 1).padStart(2, '0')}</p>
            <h2 id={`${section.id}-heading`}>{section.title}</h2>
            <div className="legal-section-content">{section.content}</div>
          </section>)}
        </article>
        <LegalTableOfContents sections={sections} activeId={activeId} />
      </div>
    </main>

    <footer className="legal-footer">
      <div className="legal-footer-inner">
        <Link href="/" className="legal-footer-brand">SYLP<span>A</span>CE</Link>
        <p>Learn. Practise. Progress.</p>
        <nav aria-label="Legal footer"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></nav>
        <small>© 2026 Sylpace</small>
      </div>
    </footer>
  </div>;
}
