import "./App.css";

export const App = () => {
  return (
    <div id="container">
      <h1>Service 🧩</h1>
      <div>
        <input type="text" placeholder="From"></input>
      </div>
      <div>
        <input type="text" placeholder="To"></input>
      </div>
      <div>
        <button id="search">Search!</button>
        <button id="terms">Terms...</button>
      </div>
    </div>
  );
};
