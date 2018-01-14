 function doGet(e) {
     return HtmlService
     .createTemplateFromFile('Index')
     .evaluate()
     .setSandboxMode(HtmlService.SandboxMode.NATIVE)
}

function writeForm(form) {

    var customerName = form.myName;
    var paidPrice = form.myMoney;

    var ss = SpreadsheetApp.openById('1XPhhCko*******9mHvgNzFZ-mG8bWyFiBjn3B_B1bc');
    var sheet = ss.getSheetByName("customers");
    var newRow = sheet.getLastRow()+1;   
    var range = sheet.getRange(newRow, 1);

    range.setValue(customerName);
    range = sheet.getRange(newRow, 2);
    range.setValue(paidPrice);
}