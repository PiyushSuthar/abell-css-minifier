var path = require('path')
var fs = require('fs');

// UTIL Function

/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {String} filter       Extension name, e.g: '.html'
 * @return {Array}               Result files with path string in an array
 */
function findFilesInDir(startPath, filter) {

  var results = [];

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filename, filter)); //recurse
    }
    else if (filename.indexOf(filter) >= 0) {
      results.push(filename);
    }
  }
  return results;
}

function MinifyHTML(htmlText) {
  return htmlText
    .replace(/\n/g, "")
    .replace(/[\t ]+\</g, "<")
    .replace(/\>[\t ]+\</g, "><")
    .replace(/\>[\t ]+$/g, ">")
    .replace(/\n[(\<\/|\<)(\w*)\>]/gm, "<")
}


/**
 * Executes after build. Ideal for generating rss, sitemap, etc.
 * @param {import('abell').ProgramInfo} programInfo
 */
function afterBuild(programInfo) {

  // Creating a Path from Abell Config and GlobalMeta
  const cssPath = path.join(programInfo.abellConfig.outputPath, programInfo.abellConfig.minifier.cssPath)

  // Checking if the path is available...
  if (!fs.existsSync(cssPath)) {
    return;
  }

  // Some Fancy Stuff
  console.log("\x1b[31m", "===================================", "\x1b[0m")
  console.log("\x1b[31m", "+ Abell CSS Minfier In Action! ⚡ +", "\x1b[0m");
  console.log("\x1b[31m", "===================================", "\x1b[0m")

  // Getting array of files with `.css` extension from the path...
  const cssFiles = findFilesInDir(cssPath, ".css")

  // Looping over and compressing the CSS!
  cssFiles.forEach(file => {
    fs.readFile(file, (err, data) => {
      // If Error, Throw err
      if (err) throw err

      const styles = data.toString().replace(/([^0-9a-zA-Z\.#])\s+/g, "$1").replace(/\s([^0-9a-zA-Z\.#]+)/g, "$1").replace(/;}/g, "}").replace(/\/\*.*?\*\//g, "");
      fs.writeFile(file, styles, (err) => {
        if (err) throw err
      })
    })
  })
}


module.exports = { afterBuild }