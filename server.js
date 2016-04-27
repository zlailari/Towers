var path    = require('path')
  , express = require('express')
  , bodyParser = require('body-parser')
  , Datastore = require('nedb');

// Embedded 'database' as PoC for MVP
db = new Datastore({filename: 'db.json', autoload: true});

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));

var PORT = 8000;

app.listen(PORT, function() {
    console.log('listening ' + PORT);
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // TODO: Make real database, make it useful
    // TODO: Don't store passwords as plaintext
    var entry = {
        username: username,
        password: password,
    };
    var res = [];
    db.find(entry, function(err, res) {
        if (err) {
            console.log("DB ERROR: " + err);
        } else if (docs.length == 0) {
            // login fail
        } else {
            // login success
        }
    });
});

app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var entry = {
        username: username,
        password: password,
    };
    db.insert(entry, function(err, newEntry) {
        if (err) {
            console.log("DB ERROR: " + err);
        } else {
            // signup success
        }
    });
});

// WARNING: No routes beyond this point
app.get('*', function(req, res){
    res.status(404).send('Invalid Page');
});
