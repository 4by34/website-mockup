console.log('starting...');

var express = require('express');
var mu = require('mu2');
var app = express();
var bodyParser = require('body-parser');
// var GoogleSpreadsheet = require("google-spreadsheet");
// try {
// var spreadSheetCreds = require("./google-sheets-creds.json");
// } catch(e){
//   console.log("No sheet creds file. Expecting environment variables for sheet creds");
// }
// var spreadSheet = new GoogleSpreadsheet(process.env.spreadsheet_id || spreadSheetCreds.spreadsheetId);
// var spreadSheetCredentials = {
//   client_email: process.env.google_service_account_email || spreadSheetCreds.googleServiceAccountEmail,
//   private_key: process.env.google_service_account_private_key || spreadSheetCreds.googleServiceAccountPrivateKey,
// };

app.use(bodyParser.json());
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/js'));                                      


app.get('/', function(request, response) {
   mu.compileAndRender('mustache/index.mustache').pipe(response);
});

app.get('/index', function(request, response) {
   mu.compileAndRender('mustache/index.mustache').pipe(response);
});

app.get('/about', function(request, response) {
   mu.compileAndRender('mustache/about.mustache').pipe(response);
});

app.get('/contact', function(request, response) {
   mu.compileAndRender('mustache/contact.mustache').pipe(response);
});

app.get('/services', function(request, response) {
   mu.compileAndRender('mustache/services.mustache').pipe(response);
});

app.get('/location', function(request, response) {
   mu.compileAndRender('mustache/location.mustache').pipe(response);
});


var port = process.env.PORT || 3000;

app.listen(port, function() {
   console.log("Listening on port " + port);
});
