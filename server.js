var path    = require('path')
  , express = require('express')
  , bodyParser = require('body-parser')
  , Datastore = require('nedb');

// Embedded 'database' as PoC for MVP
db = new Datastore({filename: 'db.json', autoload: true});

var app = express();

app.use(express.static(__dirname + '/public'));

var PORT = 8000;

app.listen(PORT, function() {
    console.log('listening ' + PORT);
});

app.post('/login', function(req, res) {

});

app.post('/signup', function(req, res) {

});

// WARNING: No routes beyond this point
app.get('*', function(req, res){
    res.status(404).send('Invalid Page');
});
