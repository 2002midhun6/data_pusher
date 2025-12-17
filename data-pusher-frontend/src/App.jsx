import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Accounts from "./pages/Accounts";
import Destinations from "./pages/Destinations";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">Webhook Manager</h1>

          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Accounts
            </NavLink>

            <NavLink
              to="/destinations"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Destinations
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Accounts />} />
        <Route path="/destinations" element={<Destinations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
