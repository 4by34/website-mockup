console.log('starting...');
// require('./rets.js');

var express = require('express');
var mu = require('mu2');
var app = express();
var bodyParser = require('body-parser');
var GoogleSpreadsheet = require("google-spreadsheet");
try {
var spreadSheetCreds = require("./google-sheets-creds.json");
} catch(e){
  console.log("No sheet creds file. Expecting environment variables for sheet creds");
}
var spreadSheet = new GoogleSpreadsheet(process.env.spreadsheet_id || spreadSheetCreds.spreadsheetId);
var spreadSheetCredentials = {
  client_email: process.env.google_service_account_email || spreadSheetCreds.googleServiceAccountEmail,
  private_key: process.env.google_service_account_private_key || spreadSheetCreds.googleServiceAccountPrivateKey,
};

app.use(bodyParser.json());
app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/pdfs'));

app.put('/sheet/:sheetName/row', function(request, response) {
  //for client-side use see http://api.jquery.com/jQuery.ajax/
  /*eg:function successFunction(data, codeString) {console.log("success handler: " + codeString);}
       function errorFunction(data, errorState, errorReason) {console.log("error " + errorReason);}
       $.ajax({
         method: "PUT",
         url: "/sheet/Emails/row",
         data: JSON.stringify({address: "9876", email: "test@test.com"}),
         processData: false,
         contentType: "application/json",
         success: successFunction,
         error: errorFunction
       });
*/
  spreadSheet.useServiceAccountAuth(spreadSheetCredentials, function(err) {
    if (err) {
      console.log(err.message);
      response.end(err.message);
      return;
    }

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

      workSheet.addRow(request.body);
      response.status(200).end();
    });
  });
});

/*spreadSheet.getRows( 1, function(err, row_data){
    console.log( 'pulled in '+ row_data.length + ' rows');
});*/
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
   mu.compileAndRender('mustache/home.mustache').pipe(response);
});

app.get('/home', function(request, response) {
   mu.compileAndRender('mustache/home.mustache').pipe(response);
});

app.get('/about', function(request, response) {
   mu.compileAndRender('mustache/about.mustache').pipe(response);
});

app.get('/listings', function(request, response) {
   mu.compileAndRender('mustache/listings.mustache').pipe(response);
});

app.get('/mortgageCalculator', function(request, response) {
   mu.compileAndRender('mustache/mortgageCalculator.mustache').pipe(response);
});

app.get('/mortgateRates', function(request, response) {
   mu.compileAndRender('mustache/mortgateRates.mustache').pipe(response);
});

app.get('/contact', function(request, response) {
  var client_ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  mu.compileAndRender('mustache/contact.mustache', {client_ip: client_ip}).pipe(response);
});

app.get('/The_Rosedale_on_Bloor', function(request, response) {
  var client_ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  mu.compileAndRender('mustache/The_Rosedale_on_Bloor.mustache', {client_ip: client_ip}).pipe(response);
});

app.get('/Forestview', function(request, response) {
  var client_ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  mu.compileAndRender('mustache/Forestview.mustache', {client_ip: client_ip}).pipe(response);
});

app.get('/CMA', function(request, response) {
  var client_ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  mu.compileAndRender('mustache/CMA.mustache', {client_ip: client_ip}).pipe(response);
});

app.get('/rentals', function(request, response) {
  spreadSheet.useServiceAccountAuth(spreadSheetCredentials, function(err){
    if (err) {
      console.log(err.message);
      return response.end("Please try again");
    }

    spreadSheet.getInfo(function(err, spreadSheetInfo) {
      if (err) { 
        console.log(err.message);
        response.end(err.message);
        return;
      }

      var workSheet = spreadSheetInfo.worksheets.filter(function(sheet) {
        return sheet.title === "Rentals";
      })[0];

      if (workSheet === undefined) {
        console.log("Worksheet not found");
        return response.status(404).end();
      }

      workSheet.getRows( function(err, rows){
        if (err) {console.log(err); return response.status(500).end();}
        var mustacheData = {rows: [{columns: []}]};

        rows.forEach(function(row, idx) {
          mustacheData.rows[mustacheData.rows.length - 1].columns.push(row);
          if (mustacheData.rows[mustacheData.rows.length - 1].columns.length === 4) {
            mustacheData.rows.push({columns:[]});
          }
        });

        mu.compileAndRender('mustache/rentals.mustache', mustacheData)
        .pipe(response);
      });
    });
  });
});

app.get('/preconstruction', function(request, response) {
  spreadSheet.useServiceAccountAuth(spreadSheetCredentials, function(err){
    if (err) {
      console.log(err.message);
      return response.end("Please try again");
    }

    spreadSheet.getInfo(function(err, spreadSheetInfo) {
      if (err) { 
        console.log(err.message);
        response.end(err.message);
        return;
      }

      var workSheet = spreadSheetInfo.worksheets.filter(function(sheet) {
        return sheet.title === "Preconstruction";
      })[0];

      if (workSheet === undefined) {
        console.log("Worksheet not found");
        return response.status(404).end();
      }

      workSheet.getRows( function(err, rows){
        if (err) {console.log(err); return response.status(500).end();}
        var mustacheData = {rows: [{columns: []}]};

        rows.forEach(function(row, idx) {
          mustacheData.rows[mustacheData.rows.length - 1].columns.push(row);
          if (mustacheData.rows[mustacheData.rows.length - 1].columns.length === 4) {
            mustacheData.rows.push({columns:[]});
          }
        });

        mu.compileAndRender('mustache/preconstruction.mustache', mustacheData)
        .pipe(response);
      });
    });
  });
});

app.get('/leaseToOwn', function(request, response) {
   mu.compileAndRender('mustache/leaseToOwn.mustache').pipe(response);
});

app.get('/services', function(request, response) {
   mu.compileAndRender('mustache/services.mustache').pipe(response);
});

app.get('/RentIncreaseGuidelines', function(request, response) {
   mu.compileAndRender('mustache/RentIncreaseGuidelines.mustache').pipe(response);
});

app.get('/propertyDetails/:propertyName', function(request, response) {
  spreadSheet.useServiceAccountAuth(spreadSheetCredentials, function(err){
    if (err) {
      console.log(err.message);
      return response.end("Please try again");
    }

    spreadSheet.getInfo(function(err, spreadSheetInfo) {
      if (err) { 
        console.log(err.message);
        response.end(err.message);
        return;
      }

      var workSheet = spreadSheetInfo.worksheets.filter(function(sheet) {
        return sheet.title === "Rentals";
      })[0];

      if (workSheet === undefined) {
        console.log("Worksheet not found");
        return response.status(404).end();
      }

      workSheet.getRows(function(err, rows){
        if (err) {console.log(err); return response.status(500).end();}
        var mustacheData = rows.filter(function(row) {
          return row.propertyname === request.params.propertyName;
        });

        if (mustacheData === undefined) {
          console.log("Property " + request.params.propertyName +
          " can not be found.");
          return response.status(404).end();
        }

        mu.compileAndRender('mustache/propertyDetails.mustache', mustacheData).
        pipe(response);
      });
    });
  });
});

app.get('/requestApp', function(request, response) {
  var client_ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  var referer = request.headers['referer'] || request.headers['referrer'];
  mu.compileAndRender('mustache/requestApp.mustache', {client_ip: client_ip, referer: referer}).pipe(response);
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
   console.log("Listening on port " + port);
});
