/*
 Nodejs file for host web
 For https web you need SSL and certificate
*/

const https = require('https'),
fs = require('fs'),
app = require('express')(),
path = require('path'),
port = 3000,
host = "0.0.0.0"/*You IP for global website*/,
/*mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.mp3': 'audio/mpeg',
  '.mov': 'video/quicktime',
},
options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
},*/

getExtension = (extname) => mimeTypes[extname] ?? 'application/octet-stream',

console.time(`Web host at http://${host}:${port}/`);
app.use(
  session({
    secret: "some secret",
    httpOnly: true,
    secure: true
  })
)
.get('/', (request, response) => {
  response.status(404);
  response.send(`Page not found`);
})
.get('/choigame.css/', (request, response) => {
  console.log(`${time()}Request for: ${request.url}`);
  response.setHeader('content-type', 'text/css');
  response.sendFile(__dirname + "/choigame.css");
})
.get('/choigame.js/', (request, response) => {
  console.log(`${time()}Request for: ${request.url}`);
  response.setHeader('content-type', 'text/javascript');
  response.sendFile(__dirname + "/choigame.js");
})
.get('/main.html/', (request, response) => {
  console.log(`${time()}Request for: ${request.url}`);
  response.setHeader('content-type', 'text/html');
  response.sendFile(__dirname + "/main.html");
})
.listen(port, host, (error) => {
  if (error) console.error(`Error: can't listen website (error code: ${error.code})`);
  else console.timeEnd(`Web host at http://${host}:${port}/`);
});
