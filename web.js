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

// app.put('/sheet/:sheetName/row', function(request, response) {
//   //for client-side use see http://api.jquery.com/jQuery.ajax/
//   /*eg:function successFunction(data, codeString) {console.log("success handler: " + codeString);}
//        function errorFunction(data, errorState, errorReason) {console.log("error " + errorReason);}
//        $.ajax({
//          method: "PUT",
//          url: "/sheet/Emails/row",
//          data: JSON.stringify({address: "9876", email: "test@test.com"}),
//          processData: false,
//          contentType: "application/json",
//          success: successFunction,
//          error: errorFunction
//        });
// */
//   spreadSheet.useServiceAccountAuth(spreadSheetCredentials, function(err) {
//     if (err) {
//       console.log(err.message);
//       response.end(err.message);
//       return;
//     }

//     spreadSheet.getInfo(function(err, spreadSheetInfo) {
//       if (err) {  //same error handling as above. should be refactored  
//         console.log(err.message);
//         response.end(err.message);
//         return;
//       }

//       var workSheet = spreadSheetInfo.worksheets.filter(function(sheet) {
//         return sheet.title === request.params.sheetName;
//       })[0];

//       if (workSheet === undefined) {
//         return response.status(404).end();
//       }

//       workSheet.addRow(request.body);
//       response.status(200).end();
//     });
//   });
// });


app.get('/sheet/:sheetName', function(request, response) {
  spreadSheet.useServiceAccountAuth(spreadSheetCredentials, function(err){
      // getInfo returns info about the sheet and an array or "worksheet" objects 
    spreadSheet.getInfo(function(err, spreadSheetInfo) {
      if (err) {  //same error handling as above. should be refactored  
        console.log(err.message);
        response.end(err.message);
        return;
      }

      var workSheet = spreadSheetInfo.worksheets.filter(function(sheet) {
        return sheet.title === request.params.sheetName;
      })[0];

      if (workSheet === undefined) {
        return response.status(404).end();
      }
      workSheet.getRows( function(err, rows){
        if (err) {console.log(err);}
        response.end(JSON.stringify(rows.map(function(row){
          return {property: row.property, unit: row.unit};
        })));
      });
    });
  });
});


app.get('/', function(request, response) {
   mu.compileAndRender('templates/home.mustache').pipe(response);
});

app.get('/index.html', function(request, response) {
   mu.compileAndRender('templates/index.mustache').pipe(response);
});

app.get('/about', function(request, response) {
   mu.compileAndRender('templates/about.mustache').pipe(response);
});

app.get('/contact', function(request, response) {
   mu.compileAndRender('mustache/contact.mustache').pipe(response);
});

app.get('/services', function(request, response) {
   mu.compileAndRender('templates/services.mustache').pipe(response);
});

app.get('/location', function(request, response) {
   mu.compileAndRender('templates/location.mustache').pipe(response);
});


var port = process.env.PORT || 3000;

app.listen(port, function() {
   console.log("Listening on port " + port);
});
