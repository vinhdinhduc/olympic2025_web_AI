import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
import {useEffect,useState} from 'react'
import Register from './Pages/register';
import Login from './Pages/login';
import Dashboard from './Pages/dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Chuyển thành true nếu có token
  }, []);

  return (
 <Router>
  <Routes>
    <Route exact path="/login" element={<Login />} />
    <Route exact path="/register" element={<Register />} />
    <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
  </Routes>
 </Router>
  );
}

export default App;
