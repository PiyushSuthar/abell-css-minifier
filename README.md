# abell-css-minifier
It minifies your Static CSS code.

> Zero Dependencies!

# Usage

Install the plugin
```sh
npm install --save-dev abell-css-minifier
```
```js
// In abell.config.js
module.exports = {
  plugins: ['abell-css-minifier'],
  minifier: {
    cssPath: "static/css" // Path to your static css in theme folder
  }
}
```

> Found Bugs? Create an Issue...