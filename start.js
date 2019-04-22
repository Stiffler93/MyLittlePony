
const https = require('https');

function main() {
  const stdin = process.openStdin(); 
  stdin.setRawMode(true);    
  stdin.resume();
  stdin.setEncoding('utf8');
  stdin.on('data', function (key) {
    process.stdout.write(key + '\n');

    if(key === '\u0003') process.exit();
  });
}

function startChallenge(ponyName, width, height, difficulty) {
  https.get('url', response => {

  });

  var postData = querystring.stringify({
    'msg' : 'Hello World!'
});

var options = {
  hostname: 'posttestserver.com',
  port: 443,
  path: '/post.php',
  method: 'POST',
  headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       'Content-Length': postData.length
     }
};

var req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end(); 
}

function getChallengeData(mazeId) {

}

function movePony(mazeId, direction) {

}

function printMaze(mazeId) {

}

main();
