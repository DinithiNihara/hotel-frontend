import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";
import EditModal from "./components/EditModal";
import Rooms from "./pages/Rooms";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/rooms" element={<Rooms />} />
          </Routes>
          <EditModal />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
