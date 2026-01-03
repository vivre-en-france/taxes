import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ca marche",
  description:
    "Explication pedagogique de la valeur en douane, de la TVA et des variations possibles."
};

const CommentCaMarchePage = () => {
  return (
    <div className="container-shell py-12">
      <div className="mb-10 space-y-4">
        <span className="chip">Pedagogie</span>
        <h1 className="text-3xl font-semibold md:text-4xl">Comment ca marche</h1>
        <p className="max-w-2xl text-sm text-black/70">
          Comprenez les notions clefs utilisees pour estimer vos droits de douane
          au Maroc.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Valeur en douane</h2>
          <p className="text-sm text-black/70">
            La valeur en douane correspond a la valeur declaree du telephone
            importee, convertie en MAD. Elle sert de base aux calculs suivants.
          </p>
          <p className="text-sm text-black/70">
            Dans cet outil, la valeur est ajustee selon l'etat (neuf ou
            occasion) et la quantite.
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">TVA</h2>
          <p className="text-sm text-black/70">
            La TVA est appliquee sur la valeur en douane additionnee aux droits
            estimes et aux frais fixes eventuels. Le taux est fixe pour garder
            une estimation simple.
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Pourquoi les montants varient</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
            <li>Classification douaniere du produit.</li>
            <li>Valeur retenue par les douanes apres verification.</li>
            <li>Frais additionnels possibles (assurance, transport, dossier).</li>
            <li>Interpretation de l'agent et controle sur place.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommentCaMarchePage;
