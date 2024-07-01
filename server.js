const { writeFileSync } = require('fs');
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname + '/public/index.html'))
);

app.get("/notes", (req, res) => 
    res.sendFile(path.join(__dirname + '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    // Read notes from the json file
    const notes = require('./db/db.json');
    res.send(notes);
});

app.post('/api/notes', (req, res) => {
    // Get the title and text from the request body
    const { title, text } = req.body;

    // Validate request body
    if (!title || !text) {
        return res.status(400).send('Invalid request body');
    }

    // Generate a random id for the new note
    const id = crypto.randomUUID();

    // Read notes from the json file
    const notes = require('./db/db.json');
    // Add the new note to the notes array
    notes.push({ title, text, id });
    // Write the notes array back to the json file
    // Now with the new note included
    writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    
    // Send the new note back to the client
    res.json({ title, text });
});

app.delete("/api/notes/:id", (req, res) => {
    // Get the id of the note to be deleted
    const id = req.params.id;

    // Read notes from the json file
    const notes = require('./db/db.json');
    // Remove the note with the given id
    const newNotes = notes.filter((note) => note.id !== id);
    // Write the new notes array back to the json file
    writeFileSync('./db/db.json', JSON.stringify(newNotes, null, 2));
    // Send the deleted note back to the client
    res.json({ id });
});

app.listen(3001, () => {
    console.log("Server is listening ton port 3001");
});