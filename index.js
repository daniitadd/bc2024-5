const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { Command } = require('commander');
const program = new Command();

const app = express();
const notes = {};
const upload = multer();
app.use(bodyParser.json());

program
  .option('-h, --host <type>', 'server host')
  .option('-p, --port <type>', 'server port')
  .option('-c, --cache <path>', 'cache directory')
  .parse(process.argv);
  
const option = program.opts();

if(!option.host){
    console.error("Please, specify the server address")
    process.exit(1);
}
if(!option.port){
    console.error("Please, specify the server port")
    process.exit(1);
}
if(!option.cache){
    console.error("Please, specify the path to the directory that will contain cached files")
    process.exit(1);
}
const { host, port, cache } = program.opts();
console.log(`Host: ${host}, Port: ${port}, Cache Directory: ${cache}`);

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

app.listen(option.port, option.host, () => {
    console.log(`Server is running on http://${option.host}:${option.port}`);
});
