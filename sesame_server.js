var fs, serverEvent, express, app, request, extend, events, eventEmitter, bodyParser, http;

fs = require('fs');
serverEvent = require('server-event');
request = require('request');
express = require('express');
extend = require('xtend');
events = require('events');
eventEmitter = new events.EventEmitter();
fs = require('fs');
https = require('https');
var bodyParser = require("body-parser");


app = express();
app.use(bodyParser());


//get the login credentials from credentials.txt
// TO DO: YOU MUST PUT YOUR LOGIN CREDENTIALS IN THIS FILE!
var credentials = JSON.parse(fs.readFileSync('./credentials.txt', 'utf8'));
console.log("Username: " + credentials.username);


app.listen(8080);

//SSE's for requests, each request that comes in sends out an SSE which the Homeowner UI listens for
serverEvent = serverEvent({ express : app });
app.get('/keyRequests', serverEvent, function (req, res) {
    req.socket.setTimeout(Infinity);
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write(':ok \n\n');
        
    eventEmitter.on('key_request', function(data) {
        res.sse(data);
    });
});

//will store keys as name/key values
var keys = [];

//return the admin page, which is the Homeowner UI
app.get('/admin', function (req, res) {
    var uid = req.params.uid,
        path = req.params[0] ? req.params[0] : 'index.html';
    res.sendfile(path, {root: './page'});
});

//return the access page, which is the Guest UI
app.get('/access', function (req, res) {
    var uid = req.params.uid,
        path = req.params[0] ? req.params[0] : 'access.html';
    res.sendfile(path, {root: './page'});
});

//returns whatever keys have been created so far
app.get('/keys', function (req, res) {
    res.json(keys);
});

//removes the specified access token from the spark cloud
app.post('/keys/revoke', function(req, res){
    console.log(req.body.name);
    res.send('POST request to the homepage');

    var index = 0;
    keys.forEach(function (key) {
        if (req.body.name === key.name) {
            request({
                uri: "https://api.spark.io/v1/access_tokens/" + key.key,
                method: "DELETE",
                auth: {
                    username: credentials.username,
                    password: credentials.password
                },
                form: {
                    access_token: key.key
                },
                json: true
            }, function (error, response, body) {
                if (error || body.error) {
                    console.log(body.error)
                } else {
                    console.log(body)
                }
            });
            keys.splice(index, 1);
        }
        index++;
    });
});

//gets an access token from the spark cloud that expires in 24 hours
app.post('/keys/grant', function(req, res){
    console.log(req.body.name);
    res.send('POST request to the homepage');

    request({
        uri: "https://api.spark.io/oauth/token",
        method: "POST",
        form: {
            username: credentials.username,
            password: credentials.password,
            grant_type: 'password',
            client_id: 'spark',
            client_secret: "spark",
            expires_in: "86400"
        },
        json: true
    }, function (error, response, body) {
        if (error || body.error) {
            console.log(body.error)
        } else {
            console.log(body.access_token)
            keys.push({name: req.body.name, key: body.access_token})
        }
    });

});

app.post('/keys/request', function(req, res){
    console.log(req.body.name);
    res.send('POST request to the homepage');
    processItem({name: req.body.name});
});

var processItem = function(obj) {
    eventEmitter.emit('key_request', obj);
    gotData = true;
};

//var inc = 0;
//setTimeout(function() {
//  //kind of a WDT, if we don't get data for 5 seconds let's kill ourselves and forever should restart us
//  processItem({"name": "Eric" + inc});
//  inc++;
//}, 5000);
