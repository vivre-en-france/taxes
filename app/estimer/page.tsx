import type { Metadata } from "next";
import EstimatorForm from "@/app/estimer/EstimatorForm";

export const metadata: Metadata = {
  title: "Estimer",
  description:
    "Formulaire pour estimer le risque et la fourchette de taxes pour plusieurs téléphones importés au Maroc."
};

const EstimerPage = () => {
  return (
    <div className="container-shell py-10 md:py-12">
      <div className="mb-8 space-y-4 md:mb-10">
        <span className="chip">Estimateur</span>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Estimez votre risque et la fourchette de taxes
        </h1>
        <p className="max-w-2xl text-sm text-black/70 lg:max-w-none">
          Ajoutez vos téléphones pour obtenir un niveau de risque, des raisons
          principales et une fourchette indicative basée sur la valeur totale.
        </p>
      </div>
      <EstimatorForm />
    </div>
  );
};

export default EstimerPage;
