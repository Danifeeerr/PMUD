const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function clock(timeSecs, sep=":")
{
    var h = Math.floor(timeSecs / 3600);
    var m = Math.floor((timeSecs % 3600) / 60);
    var s = timeSecs % 60;
    return h+sep+m+sep+s;
}

rl.question("Quants segond vols transformar? \n", (secs) => {
  console.log(`Els segons en hores, minuts i segons són ${clock(secs, "-")} respectivament`);
  rl.close();
});
