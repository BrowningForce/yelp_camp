const fetch = require('node-fetch');

fetch('https://api.openweathermap.org/data/2.5/weather?q=kharkiv&appid=6d9c019134bbdaea0df1d449dac320cc')
    .then(res => res.json())
    .then(result => console.log(result))
    .catch(err => console.log(err));