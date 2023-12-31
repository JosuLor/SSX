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
var currentURL = "";

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

        fs.access("analyzer/temp-vulns.json", fs.constants.F_OK, (err) => {
            if (err) {
              fs.writeFile("analyzer/temp-vulns.json", '{}', (err) => {
                if (err) {
                  console.error('Error al crear el archivo:', err);
                } else {
                  console.log('Archivo creado exitosamente.');
                }
              });
            } else {
              console.log('El archivo ya existe.');
            }
          });

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
        
        currentURL_JSON = txt;
    });
    
    scriptProcess.on('close', (code) => {
        analyzeAllDomain();
        //console.log("EXIT INDIVIDUAL: ", url)
    });
}

function analyzeOneURL(url) {
    const scriptProcess = spawn('bash', [appPath+"eachAnalyzer.sh", url]);
    
    scriptProcess.stdout.on('data', (data) => {
        var txt = data.toString();
        
        currentURL_JSON = txt;
    });
    
    scriptProcess.on('close', (code) => {
        //console.log("EXIT INDIVIDUAL: ", code)
        currentURL_JSON = { "END": 1 };

        fs.access("analyzer/temp-vulns.json", fs.constants.F_OK, (err) => {
            if (err) {
              fs.writeFile("analyzer/temp-vulns.json", '{}', (err) => {
                if (err) {
                  console.error('Error al crear el archivo:', err);
                } else {
                  console.log('Archivo creado exitosamente.');
                }
              });
            } else {
              console.log('El archivo ya existe.');
            }
          });
    });
}

app.get("/", (req, res) => {
    fs.unlink("analyzer/temp-vulns.json", (err) => {});
    const scriptProcess = spawn('bash', [appPath+"clean-temp.sh"]);
    currentURL_JSON = "";
    res.render("index.ejs");
});

app.post("/domainenum", (req, res) => {
    domain = req.body.domain;
    domainJSON = { "urls": -1 };
    contCurrentURL = 0;
    
    fs.unlink("analyzer/temp-vulns.json", (err) => {});
    const scriptProcess = spawn('bash', [appPath+"clean-temp.sh"]);
    currentURL_JSON = "";
    res.render("domainEnum.ejs", { domain: domain });
});

app.get("/getDomain", (req, res) => {
    res.send(domainJSON);
});

app.get("/startFullDomain", (req, res) => {
    const scriptProcess = spawn('bash', [appPath+"/test.sh", domain]);

    scriptProcess.stdout.on('data', (data) => {
        var txt = data.toString();
        //console.log("URLs: " + txt);
        domainJSON.urls = txt;
    });
    
    res.send("");
});

app.get("/startURLvuln", (req, res) => {
    analyzeDomain();
    res.send("");
});

app.get("/getIndividualURL", (req, res) => {
    //console.log(currentURL_JSON)
    res.send( currentURL_JSON );
});

app.get("/getProgressPercentage", (req, res) => {
    res.send( { "current": contURL } );
});

app.post("/urlenum", (req, res) => {
    currentURL = req.body.url;

    fs.unlink("analyzer/temp-vulns.json", (err) => {});
    const scriptProcess = spawn('bash', [appPath+"clean-temp.sh"]);
    currentURL_JSON = "";
    res.render("individualEnum.ejs", { url: currentURL });
});

app.get("/startIndividualURL", (req, res) => {
    analyzeOneURL(currentURL);
    res.send("");
});

app.get("/downloadJSON", (req, res) => {
    const file = `${__dirname}/analyzer/temp-vulns.json`
    console.log("FILE: " + file);
    res.download(file);
});

app.listen(3000, function() {console.log("Servidor lanzando en el puerto 3000")});