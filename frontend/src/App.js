// App.js
import "./App.css";
import Main from "./components/mainComponent";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "QPGenerator";

    const sessionStart = localStorage.getItem("sessionStartTime");
    const now = new Date().getTime();

    const THIRTY_MINUTES = 30 * 60 * 1000;

    if (sessionStart===null || sessionStart===undefined || now - parseInt(sessionStart) > THIRTY_MINUTES) {
      // Session expired – clear data
      localStorage.clear(); // or remove specific keys
      localStorage.setItem("sessionStartTime", now.toString()); // reset timestamp
    }
  }, []);

  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;