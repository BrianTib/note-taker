const { writeFile } = require('fs');
const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => 
    res.sendFile('./public/index.html')
);

app.get("/notes", (req, res) => 
    res.sendFile('./public/notes.html')
);

app.listen(3001, () => {
    console.log("Server is listening ton port 3001");
});