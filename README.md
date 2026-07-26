# Golden era

Gold tubes — canvas infini. Chaque version de l'app est une page HTML autonome
(React embarqué), rangée dans `versions/`. La version publiée en production est
choisie par `version.json`.

## Structure

```
versions/
  v1.html          # ancienne version
  v2.html          # version courante
version.json        # { "current": "v2" } — la version servie en prod
build.js            # copie versions/<current>.html vers public/index.html au build
```

## Prévisualiser en local

Les fichiers sont autonomes : ouvre directement `versions/v2.html` dans un navigateur.

## Publier une nouvelle version (ex. v3)

1. Ajoute le fichier `versions/v3.html`.
2. Dans `version.json`, mets `"current": "v3"`.
3. Commit + push sur `main`.
4. Redéploie sur Vercel (le build récupère automatiquement la bonne version).

C'est tout : un seul champ à changer pour basculer la prod d'une version à l'autre,
et l'historique des anciennes versions reste dans `versions/`.

## Déploiement

Hébergé sur Vercel. Le build exécute `build.js`, qui lit `version.json` puis
récupère le bundle correspondant depuis ce repo GitHub et l'écrit dans `public/`
(aucune dépendance à installer).
