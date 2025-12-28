/*jshint esversion: 6 */
const jsonrpc = require('node-json-rpc');

const client = new jsonrpc.Client({ host: 'localhost', port: 9000, path: '/' });

const task_titles = ['Conference', 'Talk', 'Exam', 'Exercise', 'Practice'];
let i = 0;

console.log("Wait ...");

setInterval(function () {
  // Llamada a 'add'
  client.call({ method: 'add', params: [task_titles[i], false] }, function (error, value) {
    if (error) {
      console.error('Result: ' + error);
    } else {
      i = i === task_titles.length - 1 ? 0 : i + 1;
      console.log("Method response for 'add': " + JSON.stringify(value));

      // Llamada a 'getAll'
      client.call({ method: 'getAll', params: [] }, function (error, value) {
        if (error) console.error('Result: ' + error);
        else console.log("Method response for 'getAll': " + JSON.stringify(value));
      });
    }
  });
}, 5000);
