import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/guests" element={<Guests />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
