import Link from "next/link";

const SiteFooter = () => {
  return (
    <footer className="border-t border-black/10 bg-white/70">
      <div className="container-shell flex flex-col gap-6 py-10 text-sm text-black/70 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-ink">Estimateur des droits de douane - Telephones</p>
          <p className="mt-2 max-w-xl">
            Outil d'estimation. Les resultats sont indicatifs et ne remplacent
            pas une decision officielle de l'administration.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/avertissement" className="btn-ghost">
            Avertissement legal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
