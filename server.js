const { writeFileSync, readFileSync } = require('fs');
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;

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
    const notes = readFileSync('./db/db.json');
    res.json(JSON.parse(notes));
});

app.post('/api/notes', async (req, res) => {
    // Get the title and text from the request body
    const { title, text } = req.body;

    // Validate request body
    if (!title || !text) {
        return res.status(400).send('Invalid request body');
    }

    // Generate a random id for the new note
    const id = crypto.randomUUID();

    // Read notes from the json file
    const notes = JSON.parse(readFileSync('./db/db.json')) || {};
    // Add the new note to the notes object
    notes[id] = { title, text, id };

    // Write the notes array back to the json file
    // Now with the new note included
    writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    // Send the new note id back to the client
    res.json({ id });
});

app.delete("/api/notes/:id", async (req, res) => {
    // Get the id of the note to be deleted
    const id = req.params.id;
    if (!id) {
        return res.status(400).send('Invalid request body');
    }

    // Read notes from the json file
    const notes = JSON.parse(readFileSync('./db/db.json'));
    // Remove the note with the given id
    delete notes[id];

    // Write the new notes array back to the json file
    writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    res.json('Note deleted successfully');
});

app.listen(PORT, () => {
    console.log("Server is listening on port", PORT);
});