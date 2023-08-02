const express = require("express");
const app = express();
const path = require("path")
const fs = require("fs")
const { spawn } = require('child_process');
const bodyParser = require("body-parser");
const { endianness } = require("os");
const appPath="./analyzer/"

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

/////////////////////////////////////
domain = "";
domainJSON = "";
domain_individual_JSON = "";
var currentURL_JSON;
var lineas;
var contURL = 0;
var nextFlag = false;
var fdinterval;

function analyzeDomain() {
    contURL = 0;

    fs.readFile("analyzer/out-sorted-https.txt", 'utf8', (err, data) => {
        if (err) {
          console.error('Error al leer el archivo:', err);
          return;
        }

        lineas = data.split('\n').filter(linea => linea.trim() !== '');
        analyzeAllDomain();
    });
}

function analyzeAllDomain() {
    if (contURL == lineas.length) {
        currentURL_JSON = { "END": 1 };

        const scriptProcess = spawn('bash', [appPath+"clean-temp.sh"]);

    } else {
        var linea = lineas[contURL];
        analyzeIndividualURL(linea);
        contURL++;
    }
}

function analyzeIndividualURL(url) {
    
    const scriptProcess = spawn('bash', [appPath+"eachAnalyzer.sh", url]);
    
    scriptProcess.stdout.on('data', (data) => {
        var txt = data.toString();
        if (txt != null) {
            //console.log("ALL: " + txt)  
            console.log("not null")
        }
        //currentURL_JSON = { "url": "urazelda" }
        currentURL_JSON = txt;
    });
    
    scriptProcess.on('close', (code) => {
        analyzeAllDomain();
        console.log("EXIT INDIVIDUAL: ", code)
    });
}

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/domainenum", (req, res) => {
    domain = req.body.domain;
    domainJSON = { "urls": -1 };
    contCurrentURL = 0;

    res.render("domainEnum.ejs", { domain: domain });
});

app.get("/getDomain", (req, res) => {
    res.send(domainJSON);
});

app.get("/startFullDomain", (req, res) => {
    const scriptProcess = spawn('bash', [appPath+"/test.sh"]);

    scriptProcess.stdout.on('data', (data) => {
        var txt = data.toString();
        console.log("URLs: " + txt);
        domainJSON.urls = txt;
    });
    
    res.send("");
});

app.get("/startURLvuln", (req, res) => {
    analyzeDomain();
    res.send("");
});

app.get("/getIndividualURL", (req, res) => {
    var j = { "url": "example.com" };
    //var currentURL_JSON = { "url": "sovietunion.su" };
    res.send( currentURL_JSON );
    //res.send(currentURL_JSON);
});






app.post("/urlenum", (req, res) => {
    url = req.body.url;
    //res.render("urlenum.ejs", { url: url });
    
    
    res.send("ASDF: " + url);
});

app.listen(3000, function() {console.log("Servidor lanzando en el puerto 3000")});