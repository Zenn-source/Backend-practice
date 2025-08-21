import express from 'express';

const app = express();
const port = 3000;

app.use(express.json()); // this turns JSON into req.body

let notes = [ // notes array
  {
    id:1,
    title: "First note",
    content: "This is a first note"
  },
];

// This makes a default landing page for the user to see
app.get("/", (req, res) => {
  res.send("Welcome to notes API! Use /notes to see all the notes.");
});

// this displays the notes stored in the array 
app.get("/notes", (req, res) => {
  res.send(notes);
});

app.get("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id); // gets the id the user wants, (parseInt turns string into a number) (req.params.id gets route params from my URL as a string) 
  const note = notes.find(n => n.id === id); //this gets the note with the correct id
  
  if (!note) {
    return res.status(404).send("Note not found"); // Error Handling
  };

  res.json(note); //returns the note 
});

app.post("/notes", (req, res) => {
  const {title, content} = req.body; // gets property in an object and assign it in a variable with the same name (destructuring)
  const newNote = {
    id: notes.length + 1,
    title,
    content
  };
  notes.push(newNote);

  res.status(201).json(newNote);
});

app.listen(port, () => {
  console.log(`Server is online at http://localhost:${port}`);
});