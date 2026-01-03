import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avertissement",
  description:
    "Mention legale: outil d'estimation sans valeur officielle pour les droits de douane."
};

const AvertissementPage = () => {
  return (
    <div className="container-shell py-12">
      <div className="mb-10 space-y-4">
        <span className="chip">Legal</span>
        <h1 className="text-3xl font-semibold md:text-4xl">Avertissement</h1>
        <p className="max-w-2xl text-sm text-black/70 lg:max-w-none">
          Cet outil fournit une estimation indicative basee sur des hypotheses
          simplifiees. Il ne remplace pas une decision officielle.
        </p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold">Mentions importantes</h2>
        <ul className="list-disc space-y-3 pl-5 text-sm text-black/70">
          <li>
            Les montants affiches sont des fourchettes basses et hautes, a titre
            indicatif uniquement.
          </li>
          <li>
            Les taux, frais et methodes peuvent changer. Verifiez toujours les
            sources officielles avant importation.
          </li>
          <li>
            L'administration des douanes reste la seule autorite capable de
            determiner les montants definitifs.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AvertissementPage;
