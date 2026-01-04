import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avertissement",
  description:
    "Mention légale: outil indicatif sans valeur officielle pour le risque et les taxes."
};

const AvertissementPage = () => {
  return (
    <div className="container-shell py-12">
      <div className="mb-10 space-y-4">
        <span className="chip">Légal</span>
        <h1 className="text-3xl font-semibold md:text-4xl">Avertissement</h1>
        <p className="max-w-2xl text-sm text-black/70 lg:max-w-none">
          Cet outil fournit une estimation indicative basée sur des hypothèses
          simplifiées. Il ne remplace pas une décision officielle.
        </p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">Mentions importantes</h2>
        <ul className="list-disc space-y-3 pl-5 text-sm text-black/70">
          <li>
            Le score de risque et les montants affichés sont indicatifs
            uniquement.
          </li>
          <li>
            Les taux, frais et méthodes peuvent changer. Vérifiez toujours les
            sources officielles avant importation.
          </li>
          <li>
            L'administration des douanes reste la seule autorité capable de
            déterminer les montants définitifs.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AvertissementPage;
