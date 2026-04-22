# 🚀 The Grand Voyage — Portfolio Belkacem Raber

> **Portfolio interactif et immersif** — Architecture de Systèmes IT, Tech Lead & DevSecOps.
> Site en production : [raberbelkacem.com](https://raberbelkacem.com)

---

## 📋 Vue d'ensemble

Portfolio-vitrine professionnel construit en **HTML/CSS/JS pur** (aucun framework), conçu comme une **landing page B2B** haut de gamme pour attirer des clients sur des missions d'architecture IT, de cybersécurité et de pilotage de projets d'envergure.

Le design narratif suit un voyage spatial vertical : du cosmos (Hero) → l'atmosphère (Ciel) → les biomes terrestres (Expertise) → les souterrains (Dette technique).

---

## 🗂️ Arborescence du Projet

```
portfolio/
├── README.md
├── .gitignore
├── documentation/          # Documentation technique
└── public_html/            # ← Dossier à déployer sur le serveur
    ├── index.html           # Page principale (1300+ lignes)
    ├── contact.html         # Page de contact (formulaire avancé)
    ├── mailer.php           # Backend PHP pour l'envoi d'emails
    ├── robots.txt           # Directives pour les crawlers
    ├── sitemap.xml          # Plan du site pour Google
    ├── .htaccess            # Optimisation serveur Apache
    │
    ├── assets/              # Médias visuels
    │   ├── og-preview.png    # Image de preview Open Graph (LinkedIn/FB)
    │   ├── nebula.webp       # Background Hero
    │   ├── earth.webp        # Background About
    │   ├── bigbang.webp      # Background Projects
    │   ├── orbit.webp        # Background projet 1
    │   ├── astronaut.webp    # Background projet 2
    │   ├── deer.webp         # Créature biome Forêt
    │   ├── eagle.webp        # Créature biome Montagne
    │   ├── dragon.webp       # Créature biome Volcan
    │   └── profile/          # Photos de profil
    │       ├── nb-lui.webp    # Photo N&B (section About)
    │       ├── Lui.webp       # Photo couleur (Footer)
    │       ├── favicon.svg    # Favicon SVG circulaire
    │       └── favicon_square.png
    │
    ├── css/
    │   ├── main.css           # Point d'entrée (imports)
    │   ├── base.css           # Reset, variables, navigation, curseur, dividers
    │   └── components/
    │       ├── hero.css        # Section Hero (black hole, shooting stars, nebula)
    │       ├── about.css       # Section À Propos (trust badges, skills)
    │       ├── ciel.css        # Section Ciel (nuages, avions, oiseaux)
    │       ├── biomes.css      # Scroll horizontal (forêt, montagne, volcan)
    │       ├── clip-reveal.css # Transition clip-path cercle
    │       ├── projects.css    # Accordéon projets
    │       ├── souterrain.css  # Section underground (flashlight, easter eggs)
    │       ├── contact.css     # Section CTA + footer
    │       └── responsive.css  # Breakpoints mobile/tablette
    │
    ├── js/
    │   ├── app.js              # Point d'entrée (imports modules)
    │   └── modules/
    │       ├── security.js      # 🛡️ Anti-scraping, anti-inspecteur, anti-download, obfuscation email
    │       ├── animations.js    # GSAP ScrollTrigger, Vanta.js, parallax, biomes scroll
    │       ├── cursor.js        # Curseur magnétique custom (dot + ring)
    │       ├── flashlight.js    # Lampe torche souterrain + overlay
    │       ├── carousel.js      # Accordéon projets interactif
    │       ├── easterEggs.js    # Konami Code + compteur de clics
    │       ├── i18n.js          # Internationalisation (FR/EN/AR)
    │       └── consent.js       # Bannière cookies RGPD + Consent Mode v2
    │
    ├── locales/
    │   ├── fr/translation.json  # 🇫🇷 Traductions françaises
    │   ├── en/translation.json  # 🇬🇧 Traductions anglaises
    │   └── ar/translation.json  # 🇸🇦 Traductions arabes (RTL)
    │
    └── legal/
        ├── mentions.html        # Mentions légales
        └── privacy.html         # Politique de confidentialité RGPD
```

---

## ⚙️ Stack Technique

| Couche | Technologies |
|--------|-------------|
| **Structure** | HTML5 sémantique, Schema.org (JSON-LD) |
| **Style** | CSS3 Vanilla (variables, @import modulaire, animations keyframes) |
| **Interactivité** | JavaScript ES6+ (modules natifs) |
| **Animations** | GSAP 3.12 + ScrollTrigger (scroll-driven), Lenis (smooth scroll) |
| **3D / WebGL** | Three.js r134 + Vanta.js (NET + FOG) |
| **i18n** | i18next + HTTP Backend + Browser Language Detector |
| **Emojis** | Twemoji (rendu consistant cross-platform) |
| **Analytics** | Google Analytics 4 (GA4) + Consent Mode v2 |
| **Backend** | PHP 8+ (mailer.php — envoi d'emails avec template HTML) |
| **Serveur** | Apache (.htaccess — GZIP, cache, HTTPS redirect, headers sécurité) |

---

## 🛡️ Sécurité Implémentée

| Protection | Détail |
|-----------|--------|
| Anti clic-droit | `contextmenu` bloqué |
| Anti inspecteur | F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, Ctrl+P bloqués |
| Anti téléchargement photos | `dragstart` bloqué + `pointer-events: none` + MutationObserver |
| Anti copier/coller | Bloqué partout sauf champs de formulaire |
| Anti capture d'écran | PrintScreen + Cmd+Shift+3/4/5 → écran noir 3s |
| Anti impression | `@media print { display: none }` |
| Anti scraping (bots) | Détection Selenium, Puppeteer, curl, wget, axios… |
| Anti DevTools | Détection par timing + avertissement console |
| Anti scraping d'email | Reconstruction par calcul mathématique (ASCII shift +7) |
| Honeypot | Faux email piège invisible injecté dans le DOM |
| CORS mailer | `Access-Control-Allow-Origin` configuré |
| Email obfusqué (HTML) | Aucune adresse en clair dans le code source |

---

## 🚀 Lancer le projet en local

### Méthode 1 : Python (recommandé pour tester rapidement)
```bash
cd public_html
python3 -m http.server 8000
```
→ Ouvrir [http://localhost:8000](http://localhost:8000)

### Méthode 2 : Node.js
```bash
cd public_html
npx serve -p 8000
```

### Méthode 3 : VS Code Live Server
1. Installer l'extension **Live Server**
2. Ouvrir `index.html`
3. Cliquer sur **Go Live** en bas à droite

> **Note :** Le formulaire de contact (`mailer.php`) ne fonctionnera qu'avec un serveur PHP (Apache/Nginx). En local avec Python ou Node, le formulaire utilisera automatiquement le fallback `mailto:`.

### Changer le port
Pour changer le port (ex: 3000 au lieu de 8000) :
```bash
python3 -m http.server 3000
# ou
npx serve -p 3000
```

---

## 🌐 Déploiement en production

1. **Hébergement** : Serveur Apache avec PHP 8+ (Hostinger, o2switch, OVH)
2. **Upload** : Envoyer le **contenu** de `public_html/` dans le dossier racine du serveur
3. **SSL** : Activer le certificat Let's Encrypt (gratuit)
4. **DNS Email** : Configurer SPF, DKIM, DMARC pour la délivrabilité
5. **Google Search Console** : Soumettre `sitemap.xml`
6. **Test** : Envoyer un message test via le formulaire

---

## 📊 SEO & Social Media

- ✅ Meta `title`, `description`, `keywords` optimisés
- ✅ Canonical URLs sur toutes les pages
- ✅ Open Graph (og:title, og:description, og:image, og:url)
- ✅ Twitter Cards (summary_large_image)
- ✅ JSON-LD Schema.org (`Person`, `ContactPage`)
- ✅ Sitemap XML + robots.txt
- ✅ Multilingue FR/EN/AR (i18next)
- ✅ Consent Mode v2 (RGPD)

---

## 🎨 Sections du site

| # | Section | Description |
|---|---------|-------------|
| 1 | **Hero (Cosmos)** | Trou noir CSS animé, nébuleuse WebP, Vanta.NET (WebGL), étoiles filantes, barre de technologies défilante |
| 2 | **À Propos** | Photo de profil N&B, orbites SVG animées, badges de confiance (6+ ans, 95%, 100%), liste de compétences |
| 3 | **Ciel (Transition)** | Vanta.FOG (WebGL), nuages géométriques, avions en parallax, vol d'oiseaux SVG, étoiles scintillantes |
| 4 | **Biomes (Expertise)** | Scroll horizontal GSAP (3 panneaux) : Forêt (dev), Montagne (cyber), Volcan (DevOps) avec créatures et animations |
| 5 | **Clip-Path Reveal** | Texte révélé par un cercle qui s'agrandit au scroll (clip-path circle) |
| 6 | **Projets** | Accordéon interactif (5 projets) avec images de fond en overlay |
| 7 | **Souterrain** | Section "dette technique" avec lampe torche interactive, easter eggs IT cachés, Konami Code |
| 8 | **Contact CTA** | Call-to-action final avec badge de disponibilité |
| 9 | **Footer** | Photo de profil couleur, lien LinkedIn, mentions légales |

---

## 📄 Licence

© 2026 Belkacem Raber — Tous droits réservés.
Toute reproduction, copie ou utilisation du code, du design ou du contenu est interdite sans autorisation écrite.
