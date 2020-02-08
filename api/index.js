// proxy the api - use node fetch
// getting the database
// cannot do websockets
const fetch = require("node-fetch");

const key = "2d7b060918a044cf76642a063bbe532a";

const root = "https://api.darksky.net/forecast";

module.exports = async function(req, res) {
  try {
    const { lon, lat } = req.query;
    const url = `${root}/${key}/${lat},${lon}`;
    const r = await fetch(url);
    const weather_json = await r.json();
    res.status(200).send(weather_json);
  } catch (e) {
    // http server errors
    res.status(500).send(e.message);
  }
};
