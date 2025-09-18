import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { v4 as uuidv4} from "uuid";
import methodOverride from "method-override";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const DATA_PATH = path.join(__dirname, "data", "notes.json");

async function readNotes() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return []; // no file yet
    throw err;
  }
}

async function writeNotes(notes) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(notes, null, 2), "utf8");
}

// App setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => res.redirect("/notes"));

// List notes (with optional search)
app.get("/notes", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toLowerCase();
    let notes = await readNotes();
    if (q) {
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.subject || "").toLowerCase().includes(q) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.render("index", { notes, q: req.query.q || "" });
  } catch (err) {
    next(err);
  }
});

// New note form
app.get("/notes/new", (req, res) => {
  res.render("new");
});

// Create note
app.post("/notes", async (req, res, next) => {
  try {
    const { title = "", subject = "", tags = "", content = "" } = req.body;
    if (!title.trim()) return res.status(400).send("Title is required");

    const note = {
      id: uuidv4(),
      title: title.trim(),
      subject: subject.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const notes = await readNotes();
    notes.push(note);
    await writeNotes(notes);
    res.redirect(`/notes/${note.id}`);
  } catch (err) {
    next(err);
  }
});

// Show note
app.get("/notes/:id", async (req, res, next) => {
  try {
    const notes = await readNotes();
    const note = notes.find((n) => n.id === req.params.id);
    if (!note) return res.status(404).send("Note not found");
    res.render("show", { note });
  } catch (err) {
    next(err);
  }
});

// Edit form
app.get("/notes/:id/edit", async (req, res, next) => {
  try {
    const notes = await readNotes();
    const note = notes.find((n) => n.id === req.params.id);
    if (!note) return res.status(404).send("Note not found");
    res.render("edit", { note });
  } catch (err) {
    next(err);
  }
});

// Update note
app.put("/notes/:id", async (req, res, next) => {
  try {
    const notes = await readNotes();
    const idx = notes.findIndex((n) => n.id === req.params.id);
    if (idx === -1) return res.status(404).send("Note not found");

    const { title = "", subject = "", tags = "", content = "" } = req.body;
    if (!title.trim()) return res.status(400).send("Title is required");

    notes[idx] = {
      ...notes[idx],
      title: title.trim(),
      subject: subject.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      content: content.trim(),
      updatedAt: new Date().toISOString(),
    };

    await writeNotes(notes);
    res.redirect(`/notes/${notes[idx].id}`);
  } catch (err) {
    next(err);
  }
});

// Delete note
app.delete("/notes/:id", async (req, res, next) => {
  try {
    let notes = await readNotes();
    notes = notes.filter((n) => n.id !== req.params.id);
    await writeNotes(notes);
    res.redirect("/notes");
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong.");
});

app.listen(port, () =>
  console.log(`StudyNotes running at http://localhost:${port}`)
);