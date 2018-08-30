/*
 * Primary file of the API
 * 
 * 
 */
var http = require("http");
var fs = require("fs");
var https = require("https");
var url = require("url");
var config = require("./config");
var _data = require('./lib/data');
var stringDecoder = require("string_decoder").StringDecoder;

//TESTING

_data.read("test", "check1", function (err,data) {
    console.log("this was the error", err,"and this was the data",data);
});


//starting http server
var HttpServer = http.createServer(function (request, response) {

    unifiedServer(request, response);
});

//starting server
HttpServer.listen(config.httpPort, function () {

    console.log("server listing you  on  port " + config.httpPort + "dude..." + config.envName);
});
var HttpsServerOptions = {
    rejectUnauthorized: false,
    requestCert: true,
    agent: false,
    
    key: fs.readFileSync('./https/77273830_localhost.key'),

    cert: fs.readFileSync('./https/77273830_localhost.cert')
}; 
//creating https server
var HttpsServer = https.createServer(HttpsServerOptions,function (request, response) {

    unifiedServer(request, response);
});


//starting https server
HttpsServer.listen(config.httpsPort, function () {

    console.log("server listing you  on  port " + config.httpsPort + "dude..." + config.envName);
});


var unifiedServer = function (request, response) {


    var parsedURL = url.parse(request.url, true);
    var method = request.method;
    var querys = parsedURL.query;
    var path = parsedURL.pathname;
    var trim = path.replace(/^\/+|\/+$/g, '');
    var headers = request.headers;
    var decoder = new stringDecoder('utf-8');
    var buffer = '';
    request.on('data', function (data) {
        buffer += decoder.write(data);
    });
    request.on('end', function () {
        buffer += decoder.end();

        var chosenHandler = typeof (router[trim]) !== 'undefined' ? router[trim] : handlers.notFound;
        var data =
        {
            'trim': trim,
            'querys': querys,
            'method': method,
            'headers': headers,
            'payload': buffer

        };
        chosenHandler(data, function (statusCode, payload) {

            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);
            response.setHeader('Content-Type', 'application/json');
            response.writeHead(statusCode);
            response.end(payloadString);
            console.log("Response", statusCode, payloadString);


        });


    });




};
 


var handlers = {};
handlers.hello= function (data, callback) {

    callback(406, { 'Message': 'Hi dude... welcome' });
};
handlers.ping = function (data, callback) {

    callback(200);
};
handlers.users = function (data, callback) {

    callback(406, { 'users': 'Lokeswararao' });
};
handlers.notFound = function (data, callback) {

    callback(404);
};
var router = {
    'hello': handlers.hello, 'users': handlers.users, 'ping': handlers.ping
};

