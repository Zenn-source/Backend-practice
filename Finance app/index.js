import express from 'express';

const app = express();
const port = 3000;


app.listen(port, (req, res) => {
  console.log(`Server is online on http://localhost:${3000}`);
});
