const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const getDirName = require('path').dirname;
const mkdirp = require('mkdirp');
const config = require('./configs/defaultConfig.js');

String.prototype.prepareAsFileName = function () {
  return this
    .replace(new RegExp("[.]", "g"), "_")
    .replace(new RegExp("/", 'g'), "_")
    .replace(new RegExp(":", "g"), "_")
    ;
}

function writeToFile(path, content, addDateTime){
  mkdirp(getDirName(path), function(error){
    if (error) return cb(error);
    content += "\r\n";
    fs.appendFile(path, content, "utf8", function () { 
      console.log("created file " + path);
    });
  })
}

var d = new Date();
var date = [d.getFullYear(), d.getMonth() + 1, d.getDay(), d.getHours(),d.getMinutes(), d.getSeconds()]
          .join("_") ;

async function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      opts.site = opts.site.prepareAsFileName();
      var filename = opts.site + "_" + opts.emulatedFormFactor + "_" + opts.throttlingMethod;
      var time =  [new Date().getHours(),new Date().getMinutes(), new Date().getSeconds()]
      .join("_");
      var pathResult = "results/" + date + "/" + time + "_" +filename + ".json";
      writeToFile(pathResult, JSON.stringify(results.lhr));
      var pathAllResults = "results/" +  date + "/result.txt";
      var performanceSiteValue = filename + ": " + results.lhr.categories.performance.score + "\n";
      writeToFile(pathAllResults, performanceSiteValue);
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.report)
    }).catch((exception) => {
      console.log("exception: ");
      console.log(exception);
      return chrome.kill()
    });
  });
}

const opts = {
  onlyCategories: ['performance'],
  maxWaitForFcp: 120 * 1000,
  maxWaitForLoad: 80 * 1000
};

async function Run() {
  for (var i = 0; i < config.sites.length; i++) {
    for (var j = 0; j < config.emulatedFormFactors.length; j++) {
      for (var k = 0; k < config.throttlingMethods.length; k++) {
        console.log("run audits for site " + config.sites[i] + " with emulatedFormFactor " + config.emulatedFormFactors[j] + " and throttlingMethod " + config.throttlingMethods[k]);
        var standardOption = "--show-paint-rects --allow-insecure-localhost --ignore-certificate-errors";
        opts.emulatedFormFactor = config.emulatedFormFactors[j];
        opts.site = config.sites[i];
        opts.throttlingMethod = config.throttlingMethods[k];
        opts.chromeFlags = [standardOption];
        //await launchChromeAndRunLighthouse(sites[i], opts).then(results => {
        // Use results!
        //});
        await launchChromeAndRunLighthouse(config.sites[i], opts);
      }
    }
  }
}

Run();