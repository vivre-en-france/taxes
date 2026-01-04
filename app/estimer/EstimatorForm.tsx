"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";
import { estimateCosts, getRules, type EstimateBreakdown } from "@/lib/estimate";

const rules = getRules();

const phoneSchema = z.object({
  price: z.coerce
    .number({ invalid_type_error: "Entrez un prix valide." })
    .positive("Le prix doit être positif."),
  currency: z.enum(["EUR", "MAD"], {
    required_error: "Sélectionnez une devise."
  }),
  packaging: z.enum(["opened", "sealed", "unknown"], {
    required_error: "Sélectionnez l'emballage."
  }),
  personalUse: z.enum(["yes", "no", "unsure"], {
    required_error: "Indiquez l'usage."
  })
});

const formSchema = z.object({
  importMode: z.enum(["voyageur", "envoi"], {
    required_error: "Sélectionnez le mode d'importation."
  }),
  phones: z
    .array(phoneSchema)
    .min(1, "Ajoutez au moins un téléphone.")
    .max(10, "Maximum 10 téléphones.")
});

type PhoneForm = {
  id: string;
  price: string;
  currency: "EUR" | "MAD";
  packaging: "opened" | "sealed" | "unknown";
  personalUse: "yes" | "no" | "unsure";
};

type PhoneFieldErrors = Partial<
  Record<"price" | "currency" | "packaging" | "personalUse", string>
>;

type FormErrors = {
  importMode?: string;
  phones?: string;
  phoneFields: Record<string, PhoneFieldErrors>;
};

type ImportMode = "voyageur" | "envoi";

const formatMad = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2
  }).format(value);

const formatMadCompact = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    maximumFractionDigits: 2
  }).format(value);

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createPhone = (overrides: Partial<PhoneForm> = {}): PhoneForm => ({
  id: createId(),
  price: "",
  currency: "MAD",
  packaging: "unknown",
  personalUse: "unsure",
  ...overrides
});

const riskLabels: Record<EstimateBreakdown["risk"]["level"], string> = {
  LOW: "Risque faible",
  MEDIUM: "Risque moyen",
  HIGH: "Risque élevé"
};

const riskStyles: Record<EstimateBreakdown["risk"]["level"], string> = {
  LOW: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-700",
  HIGH: "border-red-200 bg-red-50 text-red-700"
};

const EstimatorForm = () => {
  const [importMode, setImportMode] = useState<ImportMode>("voyageur");
  const [phones, setPhones] = useState<PhoneForm[]>([
    createPhone({
      price: "1200",
      currency: "EUR",
      packaging: "opened",
      personalUse: "yes"
    })
  ]);
  const [errors, setErrors] = useState<FormErrors>({ phoneFields: {} });
  const [result, setResult] = useState<EstimateBreakdown | null>(null);
  const [submittedMode, setSubmittedMode] = useState<ImportMode | null>(null);

  const totalValuePreview = useMemo(() => {
    return phones.reduce((sum, phone) => {
      const numericPrice = Number(phone.price);
      if (!Number.isFinite(numericPrice) || numericPrice <= 0) return sum;
      const priceInMad =
        phone.currency === "EUR"
          ? numericPrice * rules.exchangeRateEurToMad
          : numericPrice;
      return sum + priceInMad;
    }, 0);
  }, [phones]);

  const handlePhoneChange = (
    id: string,
    field: keyof Omit<PhoneForm, "id">,
    value: string
  ) => {
    setPhones((prev) =>
      prev.map((phone) => (phone.id === id ? { ...phone, [field]: value } : phone))
    );
  };

  const handleAddPhone = () => {
    if (phones.length >= 10) return;
    setPhones((prev) => [...prev, createPhone()]);
  };

  const handleRemovePhone = (id: string) => {
    if (phones.length <= 1) return;
    setPhones((prev) => prev.filter((phone) => phone.id !== id));
    setErrors((prev) => {
      const nextFields = { ...prev.phoneFields };
      delete nextFields[id];
      return { ...prev, phoneFields: nextFields };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      importMode,
      phones: phones.map(({ id, ...phone }) => phone)
    };

    const parsed = formSchema.safeParse(payload);

    if (!parsed.success) {
      const nextErrors: FormErrors = { phoneFields: {} };
      parsed.error.issues.forEach((issue) => {
        const [section, index, field] = issue.path;
        if (section === "importMode") {
          if (!nextErrors.importMode) nextErrors.importMode = issue.message;
          return;
        }
        if (section === "phones") {
          if (typeof index !== "number") {
            if (!nextErrors.phones) nextErrors.phones = issue.message;
            return;
          }
          const phoneId = phones[index]?.id;
          if (!phoneId) return;
          if (typeof field === "string") {
            const current: PhoneFieldErrors =
              nextErrors.phoneFields[phoneId] ?? {};
            if (!current[field as keyof PhoneFieldErrors]) {
              current[field as keyof PhoneFieldErrors] = issue.message;
              nextErrors.phoneFields[phoneId] = current;
            }
            return;
          }
          if (!nextErrors.phones) nextErrors.phones = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({ phoneFields: {} });
    setSubmittedMode(parsed.data.importMode);
    setResult(estimateCosts(parsed.data));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
            Paramètres
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Vos téléphones</h2>
          <p className="mt-2 text-sm text-black/70">
            Taux fixe utilisé: 1 EUR = {rules.exchangeRateEurToMad} MAD.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="importMode" className="label">
            Mode d'importation
          </label>
          <select
            id="importMode"
            name="importMode"
            className="field"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value as ImportMode)}
          >
            <option value="voyageur">Voyageur (bagages)</option>
            <option value="envoi">Envoi (colis)</option>
          </select>
          {errors.importMode ? (
            <p className="helper text-red-600">{errors.importMode}</p>
          ) : null}
        </div>

        <div className="space-y-4">
          {phones.map((phone, index) => {
            const phoneErrors = errors.phoneFields[phone.id];
            return (
              <div
                key={phone.id}
                className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">
                    Téléphone {index + 1}
                  </p>
                  {phones.length > 1 ? (
                    <button
                      type="button"
                      className="btn-ghost px-3 py-2 text-xs"
                      onClick={() => handleRemovePhone(phone.id)}
                    >
                      Supprimer
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor={`price-${phone.id}`} className="label">
                      Prix du téléphone
                    </label>
                    <input
                      id={`price-${phone.id}`}
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="field"
                      value={phone.price}
                      onChange={(event) =>
                        handlePhoneChange(phone.id, "price", event.target.value)
                      }
                    />
                    {phoneErrors?.price ? (
                      <p className="helper text-red-600">{phoneErrors.price}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`currency-${phone.id}`} className="label">
                      Devise
                    </label>
                    <select
                      id={`currency-${phone.id}`}
                      name="currency"
                      className="field"
                      value={phone.currency}
                      onChange={(event) =>
                        handlePhoneChange(phone.id, "currency", event.target.value)
                      }
                    >
                      <option value="MAD">MAD</option>
                      <option value="EUR">EUR</option>
                    </select>
                    {phoneErrors?.currency ? (
                      <p className="helper text-red-600">{phoneErrors.currency}</p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor={`packaging-${phone.id}`} className="label">
                      Emballage
                    </label>
                    <select
                      id={`packaging-${phone.id}`}
                      name="packaging"
                      className="field"
                      value={phone.packaging}
                      onChange={(event) =>
                        handlePhoneChange(phone.id, "packaging", event.target.value)
                      }
                    >
                      <option value="opened">Ouvert</option>
                      <option value="sealed">Scellé</option>
                      <option value="unknown">Inconnu</option>
                    </select>
                    {phoneErrors?.packaging ? (
                      <p className="helper text-red-600">
                        {phoneErrors.packaging}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`personal-${phone.id}`} className="label">
                      Usage personnel
                    </label>
                    <select
                      id={`personal-${phone.id}`}
                      name="personalUse"
                      className="field"
                      value={phone.personalUse}
                      onChange={(event) =>
                        handlePhoneChange(phone.id, "personalUse", event.target.value)
                      }
                    >
                      <option value="yes">Oui</option>
                      <option value="no">Non</option>
                      <option value="unsure">Pas sûr</option>
                    </select>
                    {phoneErrors?.personalUse ? (
                      <p className="helper text-red-600">
                        {phoneErrors.personalUse}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {errors.phones ? (
            <p className="helper text-red-600">{errors.phones}</p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleAddPhone}
              disabled={phones.length >= 10}
            >
              Ajouter un téléphone
            </button>
            <p className="text-xs text-black/60">Maximum 10 téléphones</p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-sand/70 p-4 text-sm text-black/70">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-ink">Résumé</p>
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-black/50">
              MAD
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-between">
              <span>Nombre total</span>
              <span className="font-semibold text-ink">{phones.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Valeur totale</span>
              <span className="font-semibold text-ink">
                {totalValuePreview > 0 ? formatMad(totalValuePreview) : "—"}
              </span>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Estimer mon risque
        </button>
      </form>

      <div className="space-y-6">
        <div className="card">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
                Niveau de risque
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] ${
                    result
                      ? riskStyles[result.risk.level]
                      : "border-black/10 bg-sand text-black/60"
                  }`}
                >
                  {result ? riskLabels[result.risk.level] : "—"}
                </span>
                <span className="text-xs text-black/60">
                  {result
                    ? `Score indicatif · ${result.risk.score}/100`
                    : "Lancez une estimation"}
                </span>
              </div>
              <p className="text-sm text-black/70">
                {result
                  ? result.risk.verdict
                  : "Décrivez vos téléphones pour obtenir un verdict."}
              </p>
            </div>
            <div className="text-left md:text-right md:border-l md:border-black/10 md:pl-6">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
                Valeur totale
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {result ? formatMad(result.totals.totalValue) : "—"}
              </p>
              <p className="text-xs text-black/60">
                {result ? `${result.totals.qty} téléphone(s)` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
              Estimation indicative si taxation appliquée
            </p>
            <h3 className="mt-2 text-xl font-semibold">Fourchette indicative</h3>
          </div>

          {result ? (
            result.tax ? (
              <div className="space-y-2">
                <p className="text-2xl font-semibold tabular-nums whitespace-nowrap sm:text-3xl">
                  {formatMadCompact(result.tax.minTax)} –{" "}
                  {formatMadCompact(result.tax.maxTax)} MAD
                </p>
                <p className="text-sm text-black/70">
                  Basée sur une valeur déclarée de{" "}
                  {formatMad(result.tax.declaredValue)}.
                </p>
              </div>
            ) : (
              <p className="text-sm text-black/70">
                {submittedMode === "envoi"
                  ? "V1: l'estimation est disponible uniquement pour les bagages."
                  : "Risque faible: pas de fourchette de taxes affichée."}
              </p>
            )
          ) : (
            <p className="text-sm text-black/70">
              Remplissez le formulaire pour obtenir une fourchette.
            </p>
          )}

          <div className="rounded-xl border border-black/10 bg-sand/70 p-4 text-sm text-black/70">
            <p className="font-semibold text-ink">Hypothèses</p>
            <ul className="mt-2 space-y-2">
              <li>
                Taux effectif estimé: {Math.round(rules.effectiveRateLow * 100)}%
                – {Math.round(rules.effectiveRateHigh * 100)}%.
              </li>
              <li>Taux de change fixe: 1 EUR = {rules.exchangeRateEurToMad} MAD.</li>
            </ul>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
              Raisons principales
            </p>
            <h3 className="mt-2 text-xl font-semibold">Pourquoi ce niveau</h3>
          </div>
          {result ? (
            result.risk.reasons.length ? (
              <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
                {result.risk.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-black/70">
                Aucun signal majeur détecté avec les informations fournies.
              </p>
            )
          ) : (
            <p className="text-sm text-black/70">
              Les raisons principales s'afficheront après estimation.
            </p>
          )}

          <div className="rounded-xl border border-black/10 bg-white/80 p-4 text-sm text-black/70">
            <p className="font-semibold text-ink">Conseils rapides</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Gardez les factures ou preuves d'achat à portée.</li>
              <li>Un téléphone ouvert et utilisé paraît plus personnel.</li>
              <li>Des explications claires réduisent les incertitudes au contrôle.</li>
            </ul>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
              Variations possibles
            </p>
            <h3 className="mt-2 text-xl font-semibold">
              Pourquoi le résultat peut varier
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-black/70">
            <li>Valeur retenue par les douanes après vérification.</li>
            <li>Classification douanière et tarifs applicables.</li>
            <li>Interprétation de l'agent au moment du contrôle.</li>
            <li>Frais additionnels possibles selon le mode d'importation.</li>
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
