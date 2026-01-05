import Link from "next/link";

const navItems = [
  { href: "/estimer", label: "Estimer" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/avertissement", label: "Avertissement" }
];

const SiteHeader = () => {
  return (
    <header className="border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="container-shell flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:py-4">
        <Link href="/" className="flex w-full items-center gap-3 md:w-auto">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-accent text-white shadow-float md:h-10 md:w-10">
            MA
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/60 md:text-sm">
              Estimateur
            </p>
            <p className="text-base font-semibold md:text-lg">
              <span className="md:hidden">Risque &amp; taxes</span>
              <span className="hidden md:inline">Risque &amp; taxes Maroc</span>
            </p>
          </div>
        </Link>
        <nav className="flex w-full items-center gap-2 overflow-x-auto text-sm font-semibold md:w-auto md:gap-3 md:overflow-visible">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-black/70 transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
