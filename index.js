const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;
const notes = {};

const upload = multer();

app.use(bodyParser.json());

app.get('/notes/:noteName', (req, res) => {
    const noteName = req.params.noteName;
    if (!notes[noteName]) {
        return res.status(404).send('Not found');
    }
    res.status(200).send(notes[noteName]);
});

app.put('/notes/:noteName', (req, res) => {
    const noteName = req.params.noteName;
    if (!notes[noteName]) {
        return res.status(404).send('Not found');
    }
    notes[noteName] = req.body.text;
    res.status(200).send('Updated');
});

app.delete('/notes/:noteName', (req, res) => {
    const noteName = req.params.noteName;
    if (!notes[noteName]) {
        return res.status(404).send('Not found');
    }
    delete notes[noteName];
    res.status(200).send('Deleted');
});

app.get('/notes', (req, res) => {
    const noteList = Object.keys(notes).map(name => ({ name, text: notes[name] }));
    res.status(200).json(noteList);
});

app.post('/write', upload.none(), (req, res) => {
    const { note_name, note } = req.body;
    if (notes[note_name]) {
        return res.status(400).send('Note already exists');
    }
    notes[note_name] = note;
    res.status(201).send('Created');
});

app.get('/UploadForm.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'UploadForm.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
