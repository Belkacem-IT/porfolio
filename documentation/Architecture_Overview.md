# Architecture Technique — The Grand Voyage Portfolio
**Projet:** raberbelkacem.com  
**Stack:** Vanilla HTML / CSS / JavaScript  
**Date:** Avril 2026

---

## Vue d'Ensemble

Le portfolio suit une architecture **Jamstack légère** sans framework JavaScript : les fichiers statiques sont servis directement par le serveur web d'hébergement (Octenium). L'absence de build step Node.js garantit des temps de réponse optimaux et une empreinte serveur minimale.

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← CI/CD : déploiement automatique via FTP (GitHub Actions)
├── documentation/              ← Docs techniques du projet
├── public_html/                ← Racine web servie publiquement
│   ├── assets/                 ← Médias (images, profil, favicon)
│   │   └── profile/
│   │       ├── Lui.webp        ← Photo de profil (compressee)
│   │       ├── favicon.svg     ← Favicon circulaire (clip SVG embarqué)
│   │       └── favicon_square.png ← Apple touch icon (iOS)
│   ├── css/
│   │   ├── main.css            ← Fichier d'entrée CSS (imports)
│   │   ├── base.css            ← Reset, tokens CSS, styles globaux
│   │   └── components/         ← CSS découpé par composant
│   │       ├── hero.css
│   │       ├── nav.css
│   │       ├── about.css
│   │       ├── expertise.css
│   │       ├── projects.css
│   │       ├── contact.css
│   │       ├── ciel.css
│   │       └── responsive.css  ← Media queries mobile-first
│   ├── js/
│   │   ├── main.js             ← Point d'entrée JS (imports modules)
│   │   └── modules/
│   │       ├── animations.js   ← GSAP ScrollTrigger orchestrations
│   │       ├── carousel.js     ← Carrousel projets (swipe, autoplay)
│   │       ├── consent.js      ← Bannière RGPD / Google Consent Mode
│   │       ├── i18n.js         ← Internationalisation (FR / EN / AR)
│   │       └── security.js     ← Anti-copy, anti-bot, anti-capture
│   ├── index.html              ← Page principale (SPA narrative)
│   ├── contact.html            ← Page de contact dédiée
│   └── mailer.php              ← Endpoint PHP traitement formulaire
└── README.md
```

---

## Couches Techniques

### 1. Rendu & Structure
- **HTML5 sémantique** : sections narratives (`#hero`, `#about`, `#ciel`, `#biomes-wrapper`, `#contact`)
- **CSS Vanilla** avec variables CSS (`--accent`, `--bg`, `--glow`) pour un design system cohérent
- **Polices** : `Plus Jakarta Sans` (corps) + `Space Grotesk` (titres) via Google Fonts

### 2. Animations & Interactivité
- **GSAP 3** + ScrollTrigger : animations scroll-driven (révélation, parallaxe, transitions de section)
- **Lenis** : smooth scroll sur desktop
- **Vanta.js** : fond WebGL paramétré — réseau 3D bleu dans le hero (`vanta.net`), brume dans `#ciel` (`vanta.fog`)
- **Curseur magnétique personnalisé** : flashlight easter egg dans la section underground

### 3. Internationalisation (i18n)
- 3 langues : Français, Anglais, Arabe (RTL)
- Détection automatique de la langue navigateur
- Attributs `data-i18n` sur tous les éléments textuels
- RTL stabilisé sur iOS Safari via viewport strict + overflow-x:hidden

### 4. Performance
- Images compressées en WebP (~150KB vs ~1.7MB originaux, gain ~90%)
- `loading="lazy"` + `decoding="async"` sur toutes les images non-critiques
- LCP priorisé avec `fetchpriority="high"` sur l'image above-the-fold
- Cache-busting versioning (`?v=1.1`) sur le CSS principal

### 5. Backend & Contact
- **mailer.php** : traitement des formulaires de contact (POST only, sanitization XSS, GeoIP)
- Pas de BDD — formulaire stateless

### 6. CI/CD (Déploiement Automatique)
- **GitHub Actions** : déclenchement sur push `main`
- **FTP-Deploy-Action v4.3.5** : upload des fichiers `public_html/` vers le serveur Octenium
- Protocol : `ftp` avec `security: loose` (compatible hébergement mutualisé)
- Secrets : `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` stockés dans GitHub Secrets

---

## Points d'Attention

> [!WARNING]
> Le fichier `mailer.php` contient la logique d'envoi d'email. S'assurer que le serveur web supporte PHP et que `mail()` est activé chez l'hébergeur.

> [!TIP]
> Pour ajouter une nouvelle langue, modifier `js/modules/i18n.js` et ajouter les clés de traduction dans l'objet `translations`.

> [!NOTE]
> La Vanta.js est chargée via CDN (pas npm). En cas de modification de version, mettre à jour les deux balises `<script>` dans `index.html`.
