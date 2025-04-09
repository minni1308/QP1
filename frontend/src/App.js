// App.js
import "./App.css";
import Main from "./components/mainComponent";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "QPGenerator";
  }, []);

  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
