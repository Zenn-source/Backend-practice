import express from 'express';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', (req, res) => {
  const now = new Date();
  const data = {
    title: 'Backend Clock',
    hour: now.getHours(),
    minute: now.getMinutes(),
    seconds: now.getSeconds()
  }
  res.render('index.ejs', data);
});

app.get("/time", (req, res) => {
  res.render("time.ejs", { title: "Real-Time Clock" });
});

app.get("/api/time", (req, res) => {
  const now = new Date();
  res.json({
    hour: now.getHours(),
    minute: now.getMinutes(),
    seconds: now.getSeconds(),
  });
});

app.listen(port, (req, res) => {
  console.log(`Server is online on http://localhost:${3000}`);
});


// SAVE ME pls haha