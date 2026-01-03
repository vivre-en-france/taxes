"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { z } from "zod";
import { estimateCosts, getRules, type EstimateBreakdown } from "@/lib/estimate";

const rules = getRules();

const formSchema = z.object({
  price: z.coerce
    .number({ invalid_type_error: "Entrez un prix valide." })
    .positive("Le prix doit etre positif."),
  currency: z.enum(["EUR", "MAD"], {
    required_error: "Selectionnez une devise."
  }),
  condition: z.enum(["neuf", "occasion"], {
    required_error: "Selectionnez l'etat."
  }),
  importMode: z.enum(["voyageur", "envoi"], {
    required_error: "Selectionnez le mode d'importation."
  }),
  quantity: z.coerce
    .number({ invalid_type_error: "Entrez une quantite valide." })
    .int("La quantite doit etre un entier.")
    .min(1, "Minimum 1.")
    .max(5, "Maximum 5.")
});

type FormValues = {
  price: string;
  currency: "EUR" | "MAD";
  condition: "neuf" | "occasion";
  importMode: "voyageur" | "envoi";
  quantity: string;
};

const formatMad = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2
  }).format(value);

const EstimatorForm = () => {
  const [values, setValues] = useState<FormValues>({
    price: "1200",
    currency: "EUR",
    condition: "neuf",
    importMode: "voyageur",
    quantity: "1"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EstimateBreakdown | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = formSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        price: fieldErrors.price?.[0] ?? "",
        currency: fieldErrors.currency?.[0] ?? "",
        condition: fieldErrors.condition?.[0] ?? "",
        importMode: fieldErrors.importMode?.[0] ?? "",
        quantity: fieldErrors.quantity?.[0] ?? ""
      });
      return;
    }

    setErrors({});
    setResult(estimateCosts(parsed.data));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
            Parametres
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Vos informations</h2>
          <p className="mt-2 text-sm text-black/70">
            Taux fixe utilise: 1 EUR = {rules.exchangeRateEurToMad} MAD.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="label">
            Prix du telephone
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            className="field"
            value={values.price}
            onChange={handleChange}
          />
          {errors.price ? <p className="helper text-red-600">{errors.price}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="currency" className="label">
              Devise
            </label>
            <select
              id="currency"
              name="currency"
              className="field"
              value={values.currency}
              onChange={handleChange}
            >
              <option value="EUR">EUR</option>
              <option value="MAD">MAD</option>
            </select>
            {errors.currency ? (
              <p className="helper text-red-600">{errors.currency}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="condition" className="label">
              Etat
            </label>
            <select
              id="condition"
              name="condition"
              className="field"
              value={values.condition}
              onChange={handleChange}
            >
              <option value="neuf">Neuf</option>
              <option value="occasion">Occasion</option>
            </select>
            {errors.condition ? (
              <p className="helper text-red-600">{errors.condition}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="importMode" className="label">
              Mode d'importation
            </label>
            <select
              id="importMode"
              name="importMode"
              className="field"
              value={values.importMode}
              onChange={handleChange}
            >
              <option value="voyageur">Voyageur (bagages)</option>
              <option value="envoi">Envoi (colis)</option>
            </select>
            {errors.importMode ? (
              <p className="helper text-red-600">{errors.importMode}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="label">
              Quantite
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              max="5"
              className="field"
              value={values.quantity}
              onChange={handleChange}
            />
            {errors.quantity ? (
              <p className="helper text-red-600">{errors.quantity}</p>
            ) : null}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Estimer mes frais
        </button>
      </form>

      <div className="space-y-6">
        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
                Estimation totale
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {result
                  ? `${formatMad(result.total.low)} - ${formatMad(result.total.high)}`
                  : "Lancez une estimation"}
              </p>
            </div>
            <span className="chip">MAD</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
            <table className="w-full text-sm">
              <thead className="bg-sand text-left text-xs uppercase tracking-[0.08em] text-black/60">
                <tr>
                  <th className="px-4 py-3">Detail</th>
                  <th className="px-4 py-3">Bas</th>
                  <th className="px-4 py-3">Haut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                <tr>
                  <td className="px-4 py-3 font-semibold">Valeur en douane</td>
                  <td className="px-4 py-3">
                    {result ? formatMad(result.customsValue) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {result ? formatMad(result.customsValue) : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Droits de douane</td>
                  <td className="px-4 py-3">
                    {result ? formatMad(result.duty.low) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {result ? formatMad(result.duty.high) : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">TVA</td>
                  <td className="px-4 py-3">
                    {result ? formatMad(result.vat.low) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {result ? formatMad(result.vat.high) : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Total a payer</td>
                  <td className="px-4 py-3 font-semibold">
                    {result ? formatMad(result.total.low) : "-"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {result ? formatMad(result.total.high) : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-black/60">
            Les frais fixes sont pris en compte uniquement pour les envois.
          </p>
        </div>

        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
              Pourquoi ce montant peut varier
            </p>
            <h3 className="mt-2 text-xl font-semibold">Variations possibles</h3>
          </div>
          <ul className="space-y-3 text-sm text-black/70">
            <li>Classification douaniere du produit.</li>
            <li>Valeur retenue par les douanes apres verification.</li>
            <li>Frais additionnels possibles selon le mode d'importation.</li>
            <li>Interpretation de l'agent au moment du controle.</li>
          </ul>
          {rules.notes.length ? (
            <div className="rounded-xl border border-black/10 bg-sand/70 p-4 text-sm text-black/70">
              <p className="font-semibold text-ink">Notes utiles</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {rules.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EstimatorForm;
