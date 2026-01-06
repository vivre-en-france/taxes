import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Explication pédagogique du score de risque de douane et de la fourchette de taxes estimées."
};

const CommentCaMarchePage = () => {
  return (
    <div className="container-shell py-12">
      <div className="mb-10 space-y-4">
        <span className="chip">Pédagogie</span>
        <h1 className="text-3xl font-semibold md:text-4xl">Comment ça marche</h1>
        <p className="max-w-2xl text-sm text-black/70">
          Comprenez les notions clés utilisées pour estimer votre risque de
          douane et une fourchette indicative de taxes au Maroc.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Score de risque</h2>
          <p className="text-sm text-black/70">
            Le risque est calculé à partir de la quantité de téléphones, de
            l'emballage (ouvert/scellé) et de l'usage déclaré (personnel ou non).
          </p>
          <p className="text-sm text-black/70">
            Plus il y a d'appareils scellés ou de valeurs élevées, plus le score
            augmente.
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Fourchette de taxes</h2>
          <p className="text-sm text-black/70">
            La fourchette est basée sur la valeur totale déclarée et un taux
            effectif bas/haut. Elle n'indique pas de taux officiels.
          </p>
          <p className="text-sm text-black/70">
            En V1, l'estimation n'est affichée que pour les voyageurs avec un
            risque moyen ou élevé.
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Pourquoi les résultats varient</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>Valeur retenue par les douanes après vérification.</li>
            <li>Classification douanière du produit.</li>
            <li>Décision de l'agent au moment du contrôle.</li>
            <li>Frais additionnels possibles selon le mode d'importation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommentCaMarchePage;
