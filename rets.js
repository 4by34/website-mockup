//create rets-client

var retsLoginUrl = 'http://rets.torontomls.net:6103/rets-treb3pv/server/login';
var retsUser ='D15jap';
var retsPassword = '65$Jp21';
var client = require('rets-client').getClientFromSettings({
    loginUrl:retsLoginUrl,
    username:retsUser,
    password:retsPassword,
    version:'RETS/1.7',
    userAgent:'RETS node-client/1.0'
});

//connection success event 
client.once('connection.success', function() {
    console.log("RETS Server connection success!");
    console.log("RETS version: " + client.retsVersion);
    console.log("Member name: " + client.memberName);

    client.getResources();

    client.once('metadata.resources.success', function(data) {
        console.log("Resource success!")
        console.log(data.Version);
        console.log(data.Date);

        for(var dataItem = 0; dataItem < data.Resources.length; dataItem++) {
            console.log(data.Resources[dataItem].ResourceID);
            console.log(data.Resources[dataItem].StandardName);
            console.log(data.Resources[dataItem].VisibleName);
            console.log(data.Resources[dataItem].ObjectVersion);
        }
    });

});

//connection failure event - C style print string with a placeholder variable
client.once('connection.failure', function(error) {
    console.log("connection to RETS server failed: " + error);
});

client.once('metadata.resources.failure', function(error) {
    console.log("Failed to get resources: " + error);
});