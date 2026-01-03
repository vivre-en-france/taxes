import type { Metadata } from "next";
import EstimatorForm from "@/app/estimer/EstimatorForm";

export const metadata: Metadata = {
  title: "Estimer",
  description:
    "Formulaire pour estimer les droits de douane et la TVA sur un telephone importe au Maroc."
};

const EstimerPage = () => {
  return (
    <div className="container-shell py-12">
      <div className="mb-10 space-y-4">
        <span className="chip">Estimateur</span>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Estimez vos frais de douane
        </h1>
        <p className="max-w-2xl text-sm text-black/70 lg:max-w-none">
          Remplissez le formulaire pour obtenir une fourchette basse et haute
          des droits de douane, TVA et total a payer.
        </p>
      </div>
      <EstimatorForm />
    </div>
  );
};

export default EstimerPage;
