import Link from "next/link";

const navItems = [
  { href: "/estimer", label: "Estimer" },
  { href: "/comment-ca-marche", label: "Comment ca marche" },
  { href: "/avertissement", label: "Avertissement" }
];

const SiteHeader = () => {
  return (
    <header className="border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white shadow-float">
            MA
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/60">
              Estimateur
            </p>
            <p className="text-lg font-semibold">Droits de douane Maroc</p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-black/70 transition hover:text-ink"
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
