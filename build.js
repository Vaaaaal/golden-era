// Build Vercel : publie la version courante en tant que public/index.html.
//
// Les bundles HTML sont trop volumineux pour être uploadés directement lors du
// déploiement, ils sont donc récupérés depuis le repo GitHub public au moment du
// build. La version à publier est déterminée par version.json ("current").
//
// Pour changer de version en production : modifier version.json, pousser, redéployer.

const https = require('https');
const fs = require('fs');
const path = require('path');

const RAW_BASE = 'https://raw.githubusercontent.com/Vaaaaal/golden-era/main';

function fetch(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Trop de redirections'));
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(fetch(res.headers.location, redirects + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode + ' pour ' + url));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  const cfg = JSON.parse((await fetch(RAW_BASE + '/version.json')).toString('utf8'));
  const current = cfg.current;
  if (!current) throw new Error('version.json : champ "current" manquant');
  console.log('Version courante :', current);

  const html = await fetch(RAW_BASE + '/versions/' + current + '.html');
  fs.mkdirSync('public', { recursive: true });
  fs.writeFileSync(path.join('public', 'index.html'), html);
  console.log('public/index.html écrit (' + html.length + ' octets) depuis versions/' + current + '.html');
}

main().catch((err) => {
  console.error('Échec du build :', err.message || err);
  process.exit(1);
});
