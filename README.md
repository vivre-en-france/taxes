# Estimateur des droits de douane au Maroc - Téléphones

MVP 100% statique pour estimer les droits de douane et la TVA sur les téléphones importés au Maroc.

## Prérequis
- Node.js 18+
- npm

## Lancer en local
```bash
npm install
npm run dev
```
Puis ouvrir `http://localhost:3000`.

## Générer le build statique
```bash
npm run build
```
Le site statique est généré dans le dossier `out/`.

## Déploiement Cloudflare Pages
1. Poussez le repo sur GitHub ou GitLab.
2. Créez un nouveau projet Cloudflare Pages.
3. Configurez :
   - Build command: `npm run build`
   - Output directory: `out`
   - Node version: 18 ou 20
4. Déployez.

## Personnalisation rapide
- Modifiez les règles dans `data/rules.v1.json`.
- Mettez à jour le domaine dans `public/robots.txt` et `public/sitemap.xml`.
