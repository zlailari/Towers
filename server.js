var path    = require('path')
  , express = require('express')
  , bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/public'));

var PORT = 8000;

app.listen(PORT, function() {
    console.log('listening ' + PORT);
});

// WARNING: No routes beyond this point
app.get('*', function(req, res){
    res.status(404).send('Invalid Page');
});
