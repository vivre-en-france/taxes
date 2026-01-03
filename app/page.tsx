import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Estimez rapidement les droits de douane pour un telephone importe au Maroc avec une fourchette basse et haute."
};

const HomePage = () => {
  return (
    <div className="container-shell py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="chip">Estimateur</span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Estimateur des droits de douane au Maroc - Telephones
          </h1>
          <p className="text-lg text-black/70">
            Comprenez le cout potentiel d'importation d'un telephone au Maroc
            avec une estimation claire, transparente et expliquee.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/estimer" className="btn-primary">
              Estimer mes frais
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-black/60">
            <div>
              <p className="font-semibold text-ink">Fourchette basse / haute</p>
              <p>Pour mieux anticiper les variations.</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Taux fixe transparent</p>
              <p>Utilise une base claire pour l'estimation.</p>
            </div>
          </div>
        </div>
        <div className="card space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
              Ce que vous obtenez
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Une estimation immediate et pedagogique
            </h2>
          </div>
          <ul className="space-y-4 text-sm text-black/70">
            <li>
              <span className="font-semibold text-ink">Valeur en douane</span>
              : calculee a partir du prix et de la quantite.
            </li>
            <li>
              <span className="font-semibold text-ink">Droits de douane</span>
              : fourchette basse et haute selon le taux applique.
            </li>
            <li>
              <span className="font-semibold text-ink">TVA</span> : estimee
              sur la base douaniere + droits.
            </li>
            <li>
              <span className="font-semibold text-ink">Total a payer</span> :
              resume clair des montants potentiels.
            </li>
          </ul>
          <p className="text-sm text-black/60">
            Passez au formulaire pour obtenir votre fourchette.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
            Simple
          </p>
          <h3 className="mt-2 text-xl font-semibold">4 champs et c'est tout</h3>
          <p className="mt-3 text-sm text-black/70">
            Prix, devise, etat, mode d'importation et quantite. Rien de plus.
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
            Transparent
          </p>
          <h3 className="mt-2 text-xl font-semibold">Regles claires</h3>
          <p className="mt-3 text-sm text-black/70">
            Les taux sont explicites pour faciliter la comprehension.
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
            Rapide
          </p>
          <h3 className="mt-2 text-xl font-semibold">Disponible partout</h3>
          <p className="mt-3 text-sm text-black/70">
            Fonctionne sur mobile et desktop, sans prise de tete.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
