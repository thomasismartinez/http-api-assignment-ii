const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, callback) => {
  const body = [];

  // handle error
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // whenever a piece of data is recieved
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // when last chunk has been recieved
  request.on('end', () => {
    console.log(body);

    const bodyString = Buffer.concat(body).toString();
    console.log(bodyString);

    const bodyParams = query.parse(bodyString);
    console.log(bodyParams);

    callback(request, response, bodyParams);
  });
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notReal,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notReal,
  },
  POST: {
    '/addUser': (request, response) => { parseBody(request, response, jsonHandler.addUser); },
  },
};

const onRequest = (request, response) => {
  // first we have to parse information from the url
  const parsedUrl = url.parse(request.url);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response, request.method);
  }

  return urlStruct[request.method]['/'];
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
