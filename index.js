const { Command } = require('commander');
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer();
const server = http.createServer(app);
app.use(express.json());

const program = new Command();
program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Cache directory path');

program.parse(process.argv);

const { host, port, cache } = program.opts();

if(!host){
    console.error("Please, specify the server address");
    process.exit(1);
}
if(!port){
    console.error("Please, specify the server port");
    process.exit(1);
}
if(!cache){
    console.error("Please, specify the path to the directory that will contain cached files");
    process.exit(1);
}

app.get('/notes/:noteName', (req, res) => {
    const notePath = path.join(cache, req.params.noteName);

    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }

    const noteText = fs.readFileSync(notePath, 'utf8');
    res.send(noteText);
});
app.put('/notes/:noteName', (req, res) => {
    const notePath = path.join(option.cache, req.params.noteName);

    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }
    const newText = req.body.text;
    if (newText === undefined) {
        return res.status(400).send('Text is required');
    }
    fs.writeFileSync(notePath, newText);
    res.send('Note updated');
});

server.listen(port, host, () => {
  console.log(`http://${host}:${port}/`);
});

