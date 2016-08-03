// Required modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
app.use(express.static(__dirname + '/public'))
// bodyParser interprets data sent to the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//require controller file for the routes and db transactions
require("./controller/news_controller")(app);

var PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log("Listening on %d", PORT);
});
