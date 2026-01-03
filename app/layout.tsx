import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Estimateur des droits de douane au Maroc - Téléphones",
    template: "%s | Estimateur douane Maroc"
  },
  description:
    "Outil pour estimer les droits de douane et la TVA sur les téléphones importés au Maroc."
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <body className={`${sora.variable} font-sans text-ink`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
