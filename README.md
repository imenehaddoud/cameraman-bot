# Cameraman Bot
Bot discord qui vérifie automatiquement si les membres d'un salon vocal ont leur caméra activée. Si ce n'est pas le cas dans les 3 secondes après l'entrée dans le canal, ils sont déconnectés de celui ci.

## Fonctionnement
- Le bot repose sur un système événementiel : il écoute l'API Discord et réagit 
en temps réel à chaque changement d'état vocal (entrée, sortie, activation de caméra). 
- Laisse un délai de "grâce" de 3 secondes après l'entrée dans le salon
- Déconnecte automatiquement les membres sans caméra

## Stack
- Node.js
- discord.js
- dotenv

## Lancement
```bash
node index.js
```
