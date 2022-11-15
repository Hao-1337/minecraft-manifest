/*
 Nodejs file for host web
 For https web you need SSL and certificate
 We are use express for this example
*/

const https = require('https'),
fs = require('fs'),
app = require('express')(),
path = require('path'),
port = 3000,
host = "0.0.0.0"/*You IP for global website*/;


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
