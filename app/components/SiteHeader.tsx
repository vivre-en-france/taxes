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
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-semibold text-white shadow-float md:h-12 md:w-12 md:text-base">
            MA
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/60 md:text-base">
              Estimateur douane
            </p>
            <p className="text-lg font-semibold leading-tight md:text-xl">
              <span className="md:hidden">Risque &amp; taxes</span>
              <span className="hidden md:inline">Risque &amp; taxes Maroc</span>
            </p>
          </div>
        </Link>
        <nav className="grid w-full grid-cols-1 gap-2 text-sm font-semibold sm:grid-cols-3 md:flex md:w-auto md:items-center md:gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center rounded-full border border-black/15 bg-white/80 px-4 py-2 text-center text-ink shadow-sm transition hover:border-black/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
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
