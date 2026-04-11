# The Grand Voyage — Portfolio Interactif

Bienvenue dans le code source de **The Grand Voyage**, mon portfolio interactif et immersif de l'année 2026. Ce projet n'est pas un simple site web : c'est une véritable **expérience cinématique** pensée pour démontrer mon expertise en architecture front-end, en design d'interaction et en cybersécurité.

## 🚀 Vision du Projet
Plutôt qu'un "dashboard" rigide ou un classique site vitrine, ce portfolio invite l'utilisateur à un voyage vertical :
- **Le Cosmos** : Un accueil dans l'espace avec des effets WebGL (Vanta.js), un trou noir en CSS pur et une pluie d'étoiles filantes.
- **La Terre** : Des environnements atmosphériques animés avec GSAP (nuages géométriques, avions, orbites de planètes).
- **Les Biomes** : Une exploration horizontale (scroll) des compétences découpées par univers physiques (Forêt, Montagnes glaciaires, Volcans) avec des easter eggs animés.
- **Le Souterrain** : Le "Dark Mode" ultime où l'on explore mes compétences structurelles complexes à l'aide d'un effet "Lampe Torche" rattaché au curseur qui révèle des "secrets IT" enfouis.

## 🛠 Stack Technique
**Architecture "Pure & Light"** : Afin de garantir des performances ultra-rapides sans lourdeur inutile, le projet s'affranchit de frameworks lourds (React/Angular) au profit d'une stack native :
- **HTML5 Sémantique**
- **Vanilla CSS (Variables, Flexbox/Grid, Animations CSS3 avancées, Clip-paths)**
- **Vanilla JavaScript (ES6 Modules)**
- **Animations & Scroll** : [GSAP 3](https://greensock.com/gsap/) et ScrollTrigger
- **Smooth Scrolling** : [Lenis](https://lenis.studiofreight.com/)
- **Effets Particules WebGL** : Vanta.js / Three.js (Héros section)

## 🛡️ Mesures de Sécurité & Anti-Bot
En tant qu'expert en Cybersécurité, appliquer mes principes à mon propre portfolio était essentiel. Le projet embarque :
1. **Module Anti-Copie (`security.js`)** : Interception logicielle des raccourcis claviers de copie (`Ctrl+C`, `Ctrl+X`), blocage du Clic-Droit et désactivation de la sélection texte (`user-select: none`).
2. **Mur Webdriver (Honeypot)** : Détection dynamique de signatures de bots (comme un tag `navigator.webdriver` laissé par Selenium/Puppeteer). En cas de détection d'une exécution automatisée, le DOM de la page est instantanément purgé et détruit.
3. **Blacklist `robots.txt`** : Restriction globale stricte interdisant l'aspiration par des scrapers génériques, l'entraînement d'IA, tout en plaçant Googlebot & Bingbot sur liste blanche pour maintenir un excellent référencement naturel (SEO).

## 🗂️ Structure des Fichiers

```text
/
├── index.html                 # Structure principale et narrative
├── contact.html               # Page de formulaire et de devis isolé
├── robots.txt                 # Contrôle d'indexation (SEO & bots)
├── assets/                    # Images de haute résolution, SVGs décoratifs
├── css/
│   ├── main.css               # Point d'entrée CSS (agrégateur)
│   ├── base.css               # Réinitialisation, Typographie, Curseur interactif
│   └── components/            # Styles modulaires par segment (biomes, hero, etc.)
└── js/
    ├── app.js                 # Orchestrateur des scripts ES6
    └── modules/
        ├── animations.js      # Configuration GSAP & ScrollTrigger
        ├── carousel.js        # Logique des sliders (supplanté au profit de CSS natif)
        ├── cursor.js          # Interpolation fluide du curseur magnétique
        ├── easterEggs.js      # Konami Code (Haut Haut Bas Bas Gauche Droite Gauche Droite B A)
        ├── flashlight.js      # Tracking du curseur et algorithme du masque lumineux
        └── security.js        # Couche cyber : Anti-scrapping et Webdriver trap
```

## 🎮 Easter Eggs
Ce portfolio est pensé pour les développeurs. Tentez d'entrer le code **KONAMI** avec les flèches directionnelles de votre clavier (`↑` `↑` `↓` `↓` `←` `→` `←` `→` `b` `a`) pour déclencher l'évènement secret.

## 📄 Licence
Ce projet est le portfolio professionnel de **Belkacem Raber**. Le code source est mis à disposition comme vitrine de mon travail. Toute republication, clonage non autorisé ou réutilisation stricte à des fins commerciales est interdite.

---
*Codé avec clarté. Construit pour durer.*
