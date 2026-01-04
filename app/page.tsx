import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Estimez le risque et la fourchette de taxes pour plusieurs téléphones importés au Maroc."
};

const HomePage = () => {
  return (
    <div className="container-shell py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="chip">Estimateur</span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Estimateur risque & taxes au Maroc - Téléphones
          </h1>
          <p className="text-lg text-black/70">
            Mesurez le risque de taxation et obtenez une fourchette indicative
            pour plusieurs téléphones, avec des raisons claires.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/estimer" className="btn-primary">
              Estimer mes frais
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-black/60">
            <div>
              <p className="font-semibold text-ink">Risque expliqué</p>
              <p>Comprenez ce qui influence l'inspection.</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Hypothèses claires</p>
              <p>Taux effectif et seuils indiqués.</p>
            </div>
          </div>
        </div>
        <div className="card space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
              Ce que vous obtenez
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Une estimation immédiate et pédagogique
            </h2>
          </div>
          <ul className="space-y-4 text-sm text-black/70">
            <li>
              <span className="font-semibold text-ink">Risque global</span> :
              basé sur la quantité, l'emballage et l'usage.
            </li>
            <li>
              <span className="font-semibold text-ink">Fourchette de taxes</span>
              : calculée sur la valeur totale déclarée.
            </li>
            <li>
              <span className="font-semibold text-ink">Raisons principales</span>
              : explications des signaux qui comptent.
            </li>
            <li>
              <span className="font-semibold text-ink">Conseils rapides</span> :
              petites actions qui réduisent le risque.
            </li>
          </ul>
          <p className="text-sm text-black/60">
            Passez au formulaire pour obtenir votre diagnostic.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
            Simple
          </p>
          <h3 className="mt-2 text-xl font-semibold">Vos téléphones, un par un</h3>
          <p className="mt-3 text-sm text-black/70">
            Chaque appareil a son prix, son emballage et son usage déclaré.
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
            Transparent
          </p>
          <h3 className="mt-2 text-xl font-semibold">Règles claires</h3>
          <p className="mt-3 text-sm text-black/70">
            Les hypothèses sont explicites pour garder une estimation stable.
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
            Rapide
          </p>
          <h3 className="mt-2 text-xl font-semibold">Disponible partout</h3>
          <p className="mt-3 text-sm text-black/70">
            Fonctionne sur mobile et desktop, sans prise de tête.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
