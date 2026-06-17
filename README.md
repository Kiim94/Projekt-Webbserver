# Projektuppgift för Backend-baserad webbutveckling, 2026

Detta är backend-delen av projektuppgiften i backend-baserad webbutveckling. 

Backend här kommunicerar med frontend för att hantera data för meny, recensioner och användare. Systemet används av frontend för att visa och uppdatera innehåll i realtid.

[Här är frontend](https://github.com/Kiim94/Projekt-Webbserver-Frontend/tree/main)

## Tekniker
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- dotenv

## Installation
```
git clone https://github.com/Kiim94/Projekt-Webbserver.git
```
```
npm install
```

## Starta server
```
node server.js
```

### API Endpoints
Meny:
- GET /api/meny - hämta alla rätter
- POST /api/meny - skapa ny rätt
- PUT /api/meny/:id - redigera/uppdatera rätt
- DELETE /api/meny/:id - radera rätt

Recensioner:
- GET /api/review - hämta alla recensioner
- POST /api/review - skapa ny recension
- DELETE /api/review/:id - _⚠️ endpoint finns men är inte implementerad i frontend_

Användare:
- POST /api/auth/register - skapa ny administratör - _⚠️ bara för inloggade, ej tillgänglig för besökare i frontend_
- POST /api/auth/login - logga in administratörer
- GET /api/auth/admins - hämta alla administratörer
- DELETE /api/auth/admins/:id - ta bort administratör

Lösenord lagras aldrig i klartext. Det hashas med bcrypt innan lagring i databasen.
