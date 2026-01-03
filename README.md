# Estimateur des droits de douane au Maroc - Telephones

MVP 100% statique pour estimer les droits de douane et la TVA sur les telephones importes au Maroc.

## Prerequis
- Node.js 18+
- npm

## Lancer en local
```bash
npm install
npm run dev
```
Puis ouvrir `http://localhost:3000`.

## Generer le build statique
```bash
npm run build
```
Le site statique est genere dans le dossier `out/`.

## Deploiement Cloudflare Pages
1. Poussez le repo sur GitHub ou GitLab.
2. Creez un nouveau projet Cloudflare Pages.
3. Configurez:
   - Build command: `npm run build`
   - Output directory: `out`
   - Node version: 18 ou 20
4. Deployez.

## Personnalisation rapide
- Modifiez les regles dans `data/rules.v1.json`.
- Mettez a jour le domaine dans `public/robots.txt` et `public/sitemap.xml`.
