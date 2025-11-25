const express = require('express');
const app = express();
app.get('/', function (req, res) {
res.send('Hello world!');
});
app.post('/', function (req, res) {
res.send('This is a Post method');
});
app.put('/', function (req, res) {
res.send('And this is a Put method');
});
app.delete('/', function (req, res) {
res.send('And this one is a Delete method');
});
const server = app.listen(8000);