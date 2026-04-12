# The Grand Voyage — Portfolio Interactif

Bienvenue dans le code source de **The Grand Voyage**, mon portfolio interactif et immersif de l'année 2026. Ce projet n'est pas un simple site web : c'est une véritable **expérience cinématique** pensée pour démontrer mon expertise en architecture front-end, en design d'interaction et en cybersécurité.

## 🚀 Vision du Projet
Plutôt qu'un "dashboard" rigide ou un classique site vitrine, ce portfolio invite l'utilisateur à un voyage vertical :
- **Le Cosmos** : Un accueil dans l'espace avec des effets WebGL (Vanta.js), un trou noir en CSS pur et une pluie d'étoiles filantes.
- **La Terre** : Des environnements atmosphériques animés avec GSAP (nuages géométriques, avions, orbites de planètes).
- **Les Biomes** : Une exploration horizontale (scroll) des compétences découpées par univers physiques (Forêt, Montagnes glaciaires, Volcans) avec des easter eggs animés.
- **Le Souterrain** : Le "Dark Mode" ultime où l'on explore mes compétences structurelles complexes à l'aide d'un effet "Lampe Torche" rattaché au curseur qui révèle des "secrets IT" enfouis.

## 🌍 Internationalisation (i18n) & UX Orbitale
Le projet intègre une gestion multilingue robuste via `i18next` :
- **Langues supportées** : Français (FR), Anglais (EN), Arabe (AR).
- **Interface Orbitale** : Un sélecteur de langue exclusif, conçu comme un astre avec des satellites en orbite, permettant un basculement fluide et cinématique.
- **RTL Support** : Basculement automatique de la mise en page (Right-To-Left) pour la langue arabe, assurant une accessibilité universelle.
- **Persistance** : Détection automatique de la langue du navigateur et mémorisation du choix utilisateur.

## 🛠 Stack Technique
**Architecture "Pure & Light"** : Afin de garantir des performances ultra-rapides, le projet s'affranchit de frameworks lourds :
- **HTML5 Sémantique**
- **Vanilla CSS** (Variables, Grid, Clip-paths, Animations 3D)
- **Vanilla JavaScript** (ES6 Modules)
- **GSAP 3** & ScrollTrigger (Animations narratives)
- **i18next** (Moteur de traduction asynchrone)
- **Lenis** (Smooth Scrolling)

## 🗂️ Structure des Fichiers

```text
/
├── index.html                 # Portails de navigation et narration
├── contact.html               # Interface de contact et devis
├── locales/                   # Dictionnaires JSON (fr, en, ar)
├── css/
│   ├── base.css               # Design System & Switcher Orbital
│   └── components/            # Styles modulaires par biome
└── js/
    ├── app.js                 # Initialisation globale
    └── modules/
        ├── i18n.js            # Moteur de traduction & Logique orbitale
        ├── animations.js      # Orchestration GSAP
        ├── cursor.js          # Curseur magnétique
        ├── flashlight.js      # Effet de masque dynamique
        └── security.js        # Couche cyber protective
```

## 🚀 Déploiement
Le projet est optimisé pour un déploiement sur **Vercel** avec un pipeline CI/CD automatisé relié à GitHub.

## 📄 Licence
Ce projet est le portfolio professionnel de **Belkacem Raber**. Toute republication ou réutilisation commerciale sans autorisation est interdite.

---
*Codé avec clarté. Construit pour durer.*
