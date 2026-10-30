# Sajilo Wallet

Practice app for the Qrius Automation QA Bootcamp classwork. A small digital wallet with four pages: Login, Dashboard, Send Money (payment) and Transaction History.

- One Node file (`server.js`) and one HTML page (`public/index.html`)
- No `npm install` needed, no database (data lives in memory)
- Real JWT login tokens, stored in `localStorage` under `sw_token`

## Run it

```bash
node server.js
```

Open http://localhost:4000. Stop it with `Ctrl + C`. Restarting the server resets all data.

To use another port: `PORT=4100 node server.js` (Git Bash).

## Test accounts

| Username | Password | Transaction PIN | Mobile (Wallet ID) | Starting balance | Status |
|---|---|---|---|---|---|
| ram.thapa | Ram@1234 | 1234 | 9841000001 | Rs. 32,450.00 | Active |
| sita.sharma | Sita@1234 | 4321 | 9851000002 | Rs. 150.00 | Active |
| hari.karki | Hari@1234 | 1111 | 9861000003 | Rs. 2,500.00 | Locked |

Other wallets you can send money to: 9800000004 (Bikash Gurung), 9810000005 (Anita Rai), 9741000006 (Pemba Sherpa).

## Pages

| URL | Page |
|---|---|
| /login | Login |
| /dashboard | Dashboard (needs login) |
| /payment | Send Money (needs login) |
| /transactions | Transaction History (needs login) |

## API (for automation)

| Method and path | What it does |
|---|---|
| POST /api/login | Body `{ "username", "password" }`. 200 with `{ token, user }`, 400 empty field, 401 wrong details, 423 locked |
| GET /api/me | Logged-in user and balance. Needs `Authorization: Bearer <token>` |
| GET /api/transactions?type=All\|Credit\|Debit&q=text | Transaction list, newest first |
| GET /api/receivers?mobile=98XXXXXXXX | Receiver name lookup, 404 if not found |
| POST /api/payments | Body `{ receiver, amount, purpose, remarks, pin }`. 201 success, 422 validation, 403 wrong PIN |
| POST /api/test/reset | Test helper. Puts all data back to the starting state (204) |
