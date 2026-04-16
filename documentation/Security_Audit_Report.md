# Rapport de Sécurité des Infrastructures Front-End et Back-End
**Projet:** The Grand Voyage (Portfolio Belkacem Raber)
**Date:** Avril 2026

Ce document détaille l'ensemble des mécanismes de sécurité et de protection de la vie privée qui ont été implémentés au niveau du socle applicatif du portfolio. L'approche est conçue pour protéger la propriété intellectuelle (images, code), bloquer les acteurs malveillants (bots de scraping) et sécuriser la capture des données sensibles.

---

## 1. Protection de la Propriété Intellectuelle (Anti-Piracy)
Le code a été durci (Hardening) pour compliquer significativement l'extraction manuelle ou le vol d'assets visuels et textuels.

- **Blocage du Menu Contextuel :** Interception de l'évènement `contextmenu` via JavaScript pour empêcher le "Clic Droit > Enregistrer sous".
- **Anti-Sélection :** Désactivation complète du `user-select` via CSS et l'écouteur `selectstart`. Aucun texte du site ne peut être surligné ou récupéré.
- **Désactivation du Copier-Coller :**
  - Neutralisation des évènements natifs du presse-papier (`copy`, `cut`, `paste`).
  - Blocage des raccourcis clavier associés (`Ctrl+C`, `Cmd+C`, `Ctrl+X`).
- **Protection des Images (Renforcée) :**
  - **CSS WebKit natif :** Applique `-webkit-touch-callout: none` ; iOS Safari n'affiche plus le menu système "Enregistrer" ou "Partager" lors d'un appui long.
  - **Drag-and-Drop Bloqué :** `user-drag: none` en CSS et `preventDefault` sur l'évènement JS `dragstart` interdisent le glisser-déposer sur Desktop.
  - **Fantômisation :** Application de `pointer-events: none` sur les balises `<img/>` et `<svg>`. Les clics "traversent" les médias, rendant toute tentative d'interaction logicielle impossible.

## 2. Protection Anti-Capture d'Écran (Anti-Screenshot & Snipping Tool)
Une logique d'aveuglement ("Capture Noire") a été mise en place pour décourager les snipers d'écran et la duplication d'écran :
- **Perte de Focus (Outil Snipping) :** Lorsque les applications natives de type "Outil Capture d'écran" de macOS (`Cmd+Shift+5`) ou Windows (`Win+Shift+S`) sont appelés, le navigateur web perd généralement le focus. Le système intercepte l'évènement `blur` et superpose instantanément un calque noir opaque avec message de prévention : `CAPTURES D'ÉCRAN NON AUTORISÉES`.
- **Touche PrintScreen (Impr. Écran) :** Écoute globale de l'évènement `keyup`. Si l'utilisateur appuie physiquement sur la touche, la page devient noire pendant 3 secondes, et le presse-papier est pollué avec un texte d'avertissement en lieu et place d'une éventuelle image.
- **Protection par Impression (CSS Print) :** Toute tentative d'impression au format PDF génèrera un document entièrement noir, purgé du DOM.

## 3. Défense du Code Client (Anti-Inspection)
Pour prévenir l'ingénierie inverse et la falsification du code côté navigateur :
- **Verrouillage des DevTools :** Désactivation des combinaisons claviers d'inspection :
  - `F12`
  - `Ctrl + Shift + I` / `Cmd + Option + I` (Inspecteur Moteur WebKit/Blink)
  - `Ctrl + Shift + J` / `Cmd + Option + J` (Console)
  - `Ctrl + U` / `Cmd + Option + U` (Code Source de la page)

## 3. Mitigations Anti-Scraping & Anti-Bot
Une protection active en arrière-plan surveille les requêtes qui trahissent une navigation automatisée.
- **Détection Headless Browser :** Le module traque la propriété `navigator.webdriver`, signalant la présence de Selenium, Cypress ou Puppeteer.
- **Honeypot User-Agent :** Vérification des empreintes connues (`PhantomJS`, `HeadlessChrome`).
- **Destruction du DOM :** En cas de détection d'un comportement d'automate (bot), un mécanisme remplace instantanément la structure HTML de la page par un mur de protection écran noir "ACCÈS REFUSÉ", purgeant tout le code sous-jacent et coupant les chaînes d'exécution JavaScript.

## 4. Sécurisation Backend & API (`mailer.php`)
Le script de liaison front-back, gérant les demandes de contact, nettoie drastiquement toute entrée externe.
- **Validation du Protocole de Transimission :** Fixe une règle stricte bloquant toutes les requêtes autres que `POST` (Code HTTP 405 : Method Not Allowed).
- **Sanétisation Stricte des Entrées (Anti-XSS) :** Chaque champ utilisateur passe par une triple défense PHP :
  - `trim()` : Nettoyage des espaces invisibles (payload spacing).
  - `strip_tags()` : Suppression aveugle des tentatives d'insertion de balises HTML/Body.
  - `htmlspecialchars()` : Encodage d'entités des caractères à risque (ex: `<script>`).
- **Filtrage Spécialisé des Données :** L'adresse email n'est retenue que si elle passe le test natif PHP `FILTER_SANITIZE_EMAIL`.
- **Validation Typologique des Métatags IP :** La récupération de la GeoIP pour la traçabilité ne s'exécute **que** si l'IP cliente (`REMOTE_ADDR`) passe le crible `FILTER_VALIDATE_IP` (bloquant les IP réservées et privées via les flags `NO_PRIV_RANGE`, `NO_RES_RANGE`), interdisant les SSRF involontaires vers le système d'OSINT local.

## 5. Bonnes Pratiques Complémentaires Implémentées
- **Sécurité des Librairies :** Aucune librairie de moteur lourd (comme React Frontend) exposant un arbre de DOM virtuel sensible n'est utilisée. Architecture HTML classique et rapide.
- **Attributs de Sécurité :** Pas d'inclusions Iframes tierces (à l'exception de reCAPTCHA le cas échéant).

---
*Ce rapport certifie que le portfolio respecte des normes élevées de durcissement applicatif (Hardening).*
