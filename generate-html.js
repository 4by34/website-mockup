const fs = require("fs");
const path = require("path");
const targetFilePath = path.join.bind(path, __dirname, ".");
const writeFile = require("util").promisify(fs.writeFile);
const mu = require("mustache");
const sheetData = require("./websiteData.json");
const templates = require("./templates.js");

Promise.all([
  sheetData,
  templates.getTemplates(),
  templates.getPartials()
])
.then(([sheetData, templates, partials])=>{
  Object.keys(templates).forEach(templateName=>{
  	console.log(templateName);
    const template = templates[templateName];
    const rendered = mu.render(template, sheetData, partials);
    writeFile(targetFilePath(`${templateName}.html`), rendered);
  });
})
.catch(console.error);
