import React, { useContext, useState } from "react";
import "./App.css";
import { Input, Button } from "antd";
import { Bar } from "react-chartjs-2";

const context = React.createContext();

function App() {
  // everything accessible, no more props
  // single useState in the app
  const [state, setState] = useState({
    searchTerm: ""
  });
  return (
    <context.Provider
      value={{
        ...state,
        set: v => setState({ ...state, ...v })
      }}
    >
      <div className="App">
        <Header />
        <Body />
      </div>
    </context.Provider>
  );
}

function Body() {
  const ctx = useContext(context);
  const { error, weather } = ctx;
  console.log(weather);
  let data;
  if (weather) {
    data = {
      labels: weather.daily.data.map(d => d.time),
      datasets: [
        {
          data: weather.daily.data.map(d => d.temperatureHigh)
        }
      ]
    };
  }

  return (
    <div className="App-body">
      {error && <div className="error">{error}</div>}
      {weather && (
        <div>
          <Bar data={data} width={800} height={400} />
        </div>
      )}
    </div>
  );
}

function Header() {
  const ctx = useContext(context);

  async function search({ searchTerm, set }) {
    try {
      console.log(searchTerm);
      const term = searchTerm;
      set({ searchTerm: "", error: "" });

      const openstreetmapurl = `https://nominatim.openstreetmap.org/search/${term}?format=json`;
      const response = await fetch(openstreetmapurl);
      const location = await response.json();
      // see how the response look
      // console.log(location);
      if (!location[0]) {
        return set({ error: "No city matching the query" });
      }
      const city = location[0];
      console.log(city.lat, city.lon);

      const key = "2d7b060918a044cf76642a063bbe532a";
      // embed variables into string
      // must build our own proxy server
      const darkskyurl = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${key}/${city.lat},${city.lon}`;
      const r2 = await fetch(darkskyurl);
      const weather = await r2.json();
      console.log(weather);
      set({ weather });
    } catch (e) {
      set({ error: e.message });
    }
  }

  return (
    <header className="App-header">
      <Input
        label="Search a location"
        value={ctx.searchTerm}
        onChange={e => ctx.set({ searchTerm: e.target.value })}
        onKeyPress={e => {
          if (e.key === "Enter") search(ctx);
        }}
        style={{ marginLeft: "0.2rem", height: "3rem", fontSize: "2rem" }}
      />
      <Button
        onClick={() => search(ctx)}
        // no search term, disable this button
        disabled={!ctx.searchTerm}
        type="primary"
        style={{ marginLeft: "0.5rem", height: "3rem" }}
      >
        Search
      </Button>
    </header>
  );
}

export default App;
