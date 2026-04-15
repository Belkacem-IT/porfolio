# 🚀 The Grand Voyage — Portfolio Belkacem Raber

Portfolio interactif immersif présentant l'expertise de Belkacem Raber en architecture de systèmes IT, DevSecOps et pilotage de projets.

**🌐 Live:** [raberbelkacem.com](https://raberbelkacem.com)

---
d
## 📁 Structure du Projet

```
the-grand-voyage-final/
├── index.html              # Page principale (Hero → About → Expertise → Projets → Contact)
├── contact.html            # Page contact avec formulaire multi-onglets
├── sitemap.xml             # Sitemap SEO
├── robots.txt              # Directives moteurs de recherche
├── css/
│   ├── base.css            # Variables, reset, cursor custom, typographie
│   └── components/
│       ├── hero.css         # Hero section, black hole, shooting stars, trusted bar
│       └── responsive.css   # Burger menu, mobile drawer, volcan, media queries
├── js/
│   ├── app.js              # Point d'entrée — importe tous les modules
│   └── modules/
│       ├── animations.js    # GSAP ScrollTrigger, reveal, parallax
│       ├── carousel.js      # Carousel projets (accordion)
│       ├── cursor.js        # Curseur custom (dot + ring)
│       ├── easterEggs.js    # Easter eggs interactifs
│       ├── flashlight.js    # Interaction lampe torche (section underground)
│       ├── i18n.js          # Internationalisation (FR/EN/AR)
│       └── security.js      # Protections anti-DevTools
├── locales/
│   ├── fr/translation.json  # Traductions françaises
│   ├── en/translation.json  # Traductions anglaises
│   └── ar/translation.json  # Traductions arabes
├── assets/                  # Images, fonts, médias
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Actions → FTP Octenium
```

## 🎨 Sections de la Page

| Section | Description |
|---------|-------------|
| **Hero (Cosmos)** | Vanta.js network, trou noir animé, étoiles filantes, bannière skills défilante |
| **À Propos** | Présentation, stats animées, astronaute illustré |
| **Transition Warp** | Effet cinématique vitesse lumière entre Hero et About |
| **Expertise (Biomes)** | Scroll horizontal avec panels thématiques (Architecture, Cloud, Sécurité...) |
| **Volcan** | SVG animé avec cratère, lave, fumée, particules |
| **Underground** | Section cachée avec interaction lampe torche et easter eggs IT |
| **Projets** | Accordion interactif avec projets détaillés |
| **Contact** | Infos, formulaire multi-onglets (Devis/Meeting/Partenariat/Autre) |

## 🛠️ Technologies

- **HTML5 / CSS3 / JavaScript ES6+** — Stack pure, pas de framework
- **GSAP + ScrollTrigger** — Animations scroll-driven
- **Vanta.js** — Background WebGL (réseau de particules)
- **Lenis** — Smooth scroll
- **i18next** — Internationalisation FR / EN / AR
- **SVG animé** — Volcan avec lave pulsante
- **CSS Custom Properties** — Design system cohérent

## 📱 Responsive

- **Desktop** : Navigation fixe avec blur, curseur custom, effets hover
- **Tablette** : Grilles adaptées, burger menu
- **Mobile** : Drawer dédié (hors `<nav>` pour iOS Safari), curseur custom caché, touch-optimized

## 🌍 SEO & Performance

- Balises meta (description, keywords, Open Graph, JSON-LD)
- Sitemap XML
- Canonical URLs → `raberbelkacem.com`
- Semantic HTML5
- Images optimisées

## 📬 Formulaire de Contact

Le formulaire utilise **Formspree** (gratuit) pour l'envoi d'emails.

### Configuration :
1. Créer un compte sur [formspree.io](https://formspree.io)
2. Créer un nouveau formulaire
3. Remplacer `YOUR_FORM_ID` dans `contact.html` par votre ID Formspree
4. Si Formspree est indisponible, le formulaire ouvre automatiquement le client mail en fallback

## 🚀 Déploiement (GitHub Actions → Octenium FTP)

Le déploiement est automatisé via GitHub Actions. Chaque push sur `main` déclenche un upload FTP vers Octenium.

### Configuration des Secrets GitHub :
Dans **Settings → Secrets and variables → Actions**, ajouter :

| Secret | Valeur |
|--------|--------|
| `FTP_SERVER` | `ftp://raberbelkacem.com` |
| `FTP_USERNAME` | `gaeehncc` |
| `FTP_PASSWORD` | Votre mot de passe cPanel |

### Commandes :
```bash
# Premier push
git init
git remote add origin https://github.com/VOTRE_USER/portfolio.git
git add .
git commit -m "Initial commit - The Grand Voyage"
git push -u origin main
```

## 📄 Licence

© 2026 Belkacem Raber. Tous droits réservés.
 
