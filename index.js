const { Command } = require('commander');
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const program = new Command();
program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Cache directory path');

program.parse(process.argv);

const { host, port, cache } = program.opts();

app.listen(port, host, () => {
  console.log(`http://${host}:${port}/`);
});