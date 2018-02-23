const fetch = require('node-fetch')

const x = fetch(
  './2016-licensed-cats.json'
)
.then(response => response.text())

x