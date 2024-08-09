import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import MenuScreen from "./components/MenuScreen";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    setIsLoggedIn(!!nombre);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/menu" />
            ) : (
              <WelcomeScreen onContinue={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route
          path="/menu"
          element={isLoggedIn ? <MenuScreen /> : <Navigate to="/" />}
        />
        {/* Eliminamos la ruta del CartScreen ya que ahora es un modal */}
      </Routes>
    </Router>
  );
};

export default App;
