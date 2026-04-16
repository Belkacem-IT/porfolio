# Anti-Scraping & Protection des Données — The Grand Voyage Portfolio
**Projet:** raberbelkacem.com  
**Date:** Avril 2026

Ce document décrit les mécanismes mis en place pour lutter contre l'extraction automatisée de données (scraping) et la réutilisation non-autorisée du contenu du portfolio.

---

## 1. Détection des Robots & Navigateurs Automatisés (Honeypot)

Le module `security.js` embarque une détection active des bots côté client :

### Détection Headless Browser
```javascript
if (navigator.webdriver) { /* Selenium, Playwright, Puppeteer */ }
```
- La propriété `navigator.webdriver` est `true` dans **tous** les navigateurs pilotés automatiquement (Selenium, Playwright, Cypress, Puppeteer en mode headless).
- En cas de détection : le DOM est immédiatement remplacé par une page noire "ACCÈS REFUSÉ" et l'exécution JS est stoppée par une exception.

### Détection des User-Agents suspects
```javascript
if (ua.includes('HeadlessChrome') || ua.includes('PhantomJS') || ua === '')
```
- Les scrapers basiques utilisent des User-Agents connus (`HeadlessChrome`, `PhantomJS`) ou envoient un UA vide.
- Même réaction : destruction du DOM.

---

## 2. Blocage des Interactions d'Extraction Manuelle

Couche défensive contre l'extraction "manuelle" (copier-coller, sauvegarde des médias) :

| Vecteur d'attaque | Contre-mesure |
|---|---|
| Clic droit → "Enregistrer sous" | `contextmenu` → `preventDefault()` |  
| Sélection de texte au curseur | `selectstart` → `preventDefault()` |
| Glisser-déposer des images | `dragstart` → `preventDefault()` |
| `Ctrl+C / Cmd+C` | `keydown` → `preventDefault()` |
| Copier/couper natif | Événements `copy`, `cut` → `preventDefault()` |
| Appui long iOS → "Enregistrer" | CSS `-webkit-touch-callout: none` |
| Drag image vers le bureau | CSS `user-drag: none` sur `img, svg` |
| Clic sur image | CSS `pointer-events: none` sur `img, svg` |
| Imprimer / "Enregistrer en PDF" | `@media print { display: none }` |

---

## 3. Protection des Médias (Images & Assets)

### CSS Global sur tous les médias
```css
img, svg {
  -webkit-user-drag: none;
  user-drag: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: none;
}
```

Cette règle est appliquée **globalement** via `base.css`, couvrant automatiquement toute nouvelle image ajoutée au site.

### Compressions & Obscurcissement
- Images converties en **WebP** (format non-trivial à extraire vs JPEG/PNG)
- Noms de fichiers non-descriptifs (`bigbang.webp`, `nebula.webp`) — pas de nom de personne ou de marque extractible via URL

---

## 4. Anti-Capture d'Écran (Screenshots)

Bien que les captures OS-level ne puissent être bloquées à 100% via le navigateur, plusieurs couches réduisent l'utilité des captures :

### Blackout sur touche PrintScreen (Windows)
- Détecte l'appui sur `PrintScreen`
- Active un overlay noir total (`anti-capture-mode`) pendant 3 secondes
- Remplace le contenu du presse-papier par un message d'avertissement

### Blocage des raccourcis Mac (`Cmd+Shift+3/4/5`)
- `preventDefault()` sur ces combinaisons
- Blackout 2 secondes

### Filigrane Dynamique Horodaté
```
raberbelkacem.com · 22:14:06 · CONFIDENTIEL
```
- Injecté en JS sur toute la surface de la page (opacity 4% — invisible visuellement mais présent dans les captures)
- Rotation aléatoire et horodatage exact
- Régénéré toutes les **8 secondes** pour ne jamais être identique
- **Effet :** toute capture contient le domaine d'origine et l'heure précise, compromettant l'attribution

### Protection Print/PDF
```css
@media print {
  html, body { background: #000 !important; display: none !important; }
}
```

---

## 5. Sécurisation du Formulaire Backend (`mailer.php`)

Le point d'entrée POST (`mailer.php`) est le seul endpoint dynamique du site :

### Protections Active
- **Méthode HTTP stricte** : rejette tout ce qui n'est pas `POST` (code 405)
- **Sanitization XSS** : `trim()` + `strip_tags()` + `htmlspecialchars()` sur tous les champs
- **Filtrage email** : `FILTER_SANITIZE_EMAIL` + validation format
- **Anti-SSRF GeoIP** : appel externe (`ip-api.com`) uniquement si l'IP passe `FILTER_VALIDATE_IP` avec flags `NO_PRIV_RANGE` + `NO_RES_RANGE`
- `Access-Control-Allow-Origin: *` — à restreindre au domaine en production si CORS est un vecteur d'attaque

> [!WARNING]  
> Le header `Access-Control-Allow-Origin: *` accepte les requêtes cross-origin de n'importe quel domaine. Si des abus sont observés (spam via API), le restreindre à `https://raberbelkacem.com`.

---

## 6. Limites Connues & Recommandations Futures

| Limite | Solution recommandée |
|---|---|
| Captures OS-level (GPU-level) non bloquables | Watermark visible + mentions légales |
| Bots JS-capable (Puppeteer en mode non-headless) | Ajouter un reCAPTCHA v3 invisible sur les formulaires |
| Rate-limiting absent côté PHP | Ajouter un token `X-CSRF` ou honeypot champ caché |
| Log des tentatives de scraping | Intégrer un service de monitoring (ex: Cloudflare Bot Management) |

---

*Ce document est à mettre à jour à chaque ajout de nouveau vecteur de protection.*
