# 🛠️ Historique des Erreurs de Déploiement FTP (GitHub Actions)

Ce document trace les différentes erreurs rencontrées lors de la tentative d'automatisation du déploiement via GitHub Actions vers l'hébergeur (Octenium / cPanel), afin d'éviter de reproduire ces erreurs à l'avenir.

## ❌ Erreur 1 : Rejet du FTP basique (Plaintext)
- **Configuration testée :** Action `SamKirkland/FTP-Deploy-Action@v4.3.5` avec `protocol: ftp` et `security: loose`.
- **Erreur obtenue :** `Server sent FIN packet unexpectedly, closing connection.`
- **Raison :** L'hébergeur bloque purement et simplement les connexions non sécurisées (port 21 sans TLS). Le pare-feu ferme la connexion TCP immédiatement (FIN packet) dès qu'il détecte que la communication n'est pas chiffrée.

## ❌ Erreur 2 : Protocole Invalide (SFTP)
- **Configuration testée :** Action `SamKirkland/FTP-Deploy-Action@v4.3.5` avec `protocol: sftp` et `port: 22`.
- **Erreur obtenue :** `protocol: invalid parameter - you provided "sftp".`
- **Raison :** Cette action GitHub Node.js spécifique ne supporte pas le protocole SFTP (qui passe par SSH). Elle est limitée à FTP et FTPS.

## ❌ Erreur 3 : Handshake SSL / TLS (Wrong Version Number)
- **Configuration testée :** Action `SamKirkland/FTP-Deploy-Action@v4.3.5` avec `protocol: ftps-legacy` sur le port 21.
- **Erreur obtenue :** `SSL routines:ssl3_get_record:wrong version number:../deps/openssl/openssl/ssl/record/ssl3_record.c:350`
- **Raison :** L'action a tenté de négocier une connexion SSL implicite (Implicit TLS) directement sur le port 21. Or, le serveur cPanel est configuré en "FTPS Explicite" : il répond d'abord avec un message d'accueil en texte clair ("220 ProFTPD"), ce que le client SSL de Node.js n'arrive pas à parser (d'où l'erreur de "version").

## ❌ Erreur 4 : Rejet du FTPS Strict (Firewall NAT / IP Block)
- **Configuration testée :** Action `SamKirkland/FTP-Deploy-Action@v4.3.5` avec `protocol: ftps` et `security: strict` sur le port 21.
- **Erreur obtenue :** `Server sent FIN packet unexpectedly, closing connection.`
- **Raison :** Bien que ce soit la configuration techniquement exacte pour le FTPS Explicite, l'action NodeJS `basic-ftp` échoue souvent lors de la négociation des ports passifs à travers le NAT de GitHub Actions, ou le pare-feu du serveur (ex: Imunify360) identifie l'agent de transfert NodeJS comme une menace potentielle et coupe la connexion.

---

## ✅ LA SOLUTION DÉFINITIVE (Implémentée)

Pour contourner de manière fiable tous les bugs liés à NodeJS et aux actions communautaires, la solution adoptée est de recourir à **un script bash natif utilisant `lftp`**.

**Configuration qui fonctionne :**
```yaml
      - name: 🚀 Deploy to Octenium via lftp
        env:
          FTP_USER: ${{ secrets.FTP_USERNAME }}
          FTP_PASS: ${{ secrets.FTP_PASSWORD }}
          FTP_HOST: ${{ secrets.FTP_SERVER }}
        run: |
          sudo apt-get update -y && sudo apt-get install -y lftp
          lftp -c "
          set ftp:ssl-allow yes;
          set ftp:ssl-force true;
          set ftp:ssl-protect-data true;
          set ssl:verify-certificate no;
          open -u \"$FTP_USER\",\"$FTP_PASS\" $FTP_HOST;
          mirror -R ./public_html/ /public_html/ --ignore-time --parallel=10 --exclude-glob .git* --exclude-glob node_modules --exclude-glob .github
          "
```

### Pourquoi ça marche :
1. **`set ftp:ssl-force true`** : Force le FTPS Explicite (obligatoire sur Octenium).
2. **`set ftp:ssl-protect-data true`** : Chiffre non seulement les identifiants, mais aussi le transfert des fichiers.
3. **`set ssl:verify-certificate no`** : Empêche l'arrêt du transfert si le certificat SSL de l'hébergeur (souvent auto-signé pour les services FTP cPanel) ne correspond pas parfaitement.
4. **`mirror -R`** : L'outil de synchronisation de `lftp` gère les transferts parallèles de manière native et tolère les micro-coupures réseau infiniment mieux que les implémentations NodeJS.

### Bug Critique Résolu
**Ne JAMAIS utiliser `server-dir: /` avec un compte FTP cPanel principal.**
Lors des premiers essais de configuration, le chemin de destination était `/`. Cela aurait téléversé les fichiers du site directement dans le dossier racine de l'utilisateur (`/home/utilisateur/`), et non pas dans le répertoire public. **Le répertoire de destination doit impérativement être `/public_html/`.**
