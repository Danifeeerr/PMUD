const express = require('express');
const app = express();
app.use(express.static('public'));
app.get('/', function (req, res) {
res.send('Static server. Add a path.');
});
const server = app.listen(8000);