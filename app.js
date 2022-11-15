const http = require('https'),
fs = require('fs'),
app = require('express')(),
path = require('path'),
session = require('cookie-session'),
port = 3000,
host = "192.168.1.7",
mimeTypes = {
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
/**options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
},*/

getExtension = (extname) => mimeTypes[extname] ?? 'application/octet-stream',
time = () => {
  let date = new Date();
  let [m,
    s,
    ms] = [date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()];
  return `[${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${m > 9 ? m: `0${m}`}:${s > 9 ? s: `0${s}`}:${ms > 99 ? ms: ms > 9 ? `0${ms}`: `00${ms}`}]`;
};

//Web
console.time(`Web host at http://${host}:${port}/`);
app.use(
  session({
    secret: "some secret",
    httpOnly: true, // Don't let browser javascript access cookies.
    secure: true, // Only use cookies over https.
  })
)
.get('/', (request, response) => {
  response.status(404);
  response.send(`Page not found`);
})
.get('/sus.png/', (request, response) => {
  console.log(`${time()}Request for: ${request.url}`);
  response.setHeader('content-type', 'image/png');
  response.sendFile(__dirname + "/sus.png");
})
.get('/test.mp3/', (request, response) => {
  console.log(`${time()}Request for: ${request.url}`);
  response.setHeader('content-type', 'audio/mpeg');
  response.sendFile(__dirname + "/set-fire-to-the-rain.mp3");
})
.get('/no-one-care.mp4/', (request, response) => {
  console.log(`${time()}Request for: ${request.url}`);
  response.setHeader('content-type', 'video/mp4');
  response.sendFile(__dirname + "/no-one-care.mp4");
})
.get('/main.html/', (request, response) => {
  console.log(`${time()}Request for: ${request.url}`);
  response.setHeader('content-type', 'text/html');
  response.sendFile(__dirname + "/main.html");
})
.listen(port, host, (error) => {
  if (error) console.error(`Error: can't listen storage (error code: ${error.code})`);
  else console.timeEnd(`Web host at http://${host}:${port}/`);
});
