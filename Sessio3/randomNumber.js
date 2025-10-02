/*const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
*/

const random = limit => Math.floor(Math.random() * limit);



/*rl.question("Quin es el limit? \n", (limit) => {
  console.log(`El número generat és ${random(limit)}`);
  rl.close();
});
*/
console.log(random(6));



