const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("."));

const DATA = "users.json";
if (!fs.existsSync(DATA)) fs.writeFileSync(DATA, "[]");

app.post("/api/register", (req, res) => {
  const users = JSON.parse(fs.readFileSync(DATA));
  const { name, pwHash } = req.body;
  if (users.find(u => u.name === name))
    return res.status(400).json({ error: "exists" });

  users.push({ name, pwHash, role: "member" });
  fs.writeFileSync(DATA, JSON.stringify(users, null, 2));
  res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
  const users = JSON.parse(fs.readFileSync(DATA));
  const u = users.find(x => x.name === req.body.name);
  if (!u || u.pwHash !== req.body.pwHash)
    return res.status(401).json({ error: "bad" });

  res.json(u);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server läuft auf Port", PORT));
