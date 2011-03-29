var http = require('http')
  , journey = require('journey')
  , router = new(journey.Router);

var util = require('util')
  , exec = require('child_process').exec;

var readability = require('readability');

router.get(/^(.*)/).bind(function(req, res, resource) {
  var curl = "curl " + resource
    , child;

  child = exec(curl, function(err, stdout, stderr) {
    if(err === null) {
      readability.parse(stdout, resource, function(result) {
        res.send({title: result.title, content: result.content});
      })
    } else {
      console.log(" ------------- ");
      console.log("ERROR: " + err + " :: from URL :: " + resource);
      console.log(" ------------- ");

      res.send({error: "Issue in parsing requested content"});
    }
  })
})

http.createServer(function(request, response) {
  var body = "";

  request.addListener('data', function (chunk) { body += chunk });
  request.addListener('end', function () {
    router.handle(request, body, function (result) {
      response.writeHead(result.status, result.headers);
      response.end(result.body);
    });
  });
}).listen(2323, "127.0.0.1");

console.log('Server running at http://127.0.0.1:2323/');
