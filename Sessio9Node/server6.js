const http = require('http');
const url = require('url');
const circle = require('./circle2.js');
const hostname = '127.0.0.1';
const port = 8000;
http.createServer((req, res) => {
 let q = url.parse(req.url, true);
 let params = q.query;
 if ('r' in params) {
 let c = circle(params.r);
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.write(`Perimeter: ${c.perimeter()}\n`);
 res.end(`Area: ${c.area()}\n`);
 } else {
 res.writeHead(404, {'Content-Type': 'text/html'});
 return res.end("404 Param r Not Found");
 }
}).listen(port, hostname, () => {
 console.log(`Server running at http://${hostname}:${port}/`);
});