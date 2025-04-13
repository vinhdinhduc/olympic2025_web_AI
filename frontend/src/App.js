import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
import {useEffect,useState} from 'react'
import Register from './Pages/Auth/register';
import Login from './Pages/Auth/login';
import Dashboard from './Pages/Dashboard/dashboard';
import ExerciseList from './components/ExerciseList';
import ExerciseCreate from './components/ExerciseCreate';
// import QuizPage from "./Pages/QuizPage";
import Profile from './Pages/Profile/Profile';
import Home from './Pages/Home/Home';
import SuggestedExercises from "./Pages/SuggestedExercises";
import ExerciseDetail from "./components/ExerciseDetail";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Chuyển thành true nếu có token
   
    
  }, []);

  return (
 <Router>
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/exercises" element={<ExerciseList />} />

        <Route path="/exercise/detail/:id" element={<ExerciseDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
         <Route
      path="/exercises/new"
        element={isAuthenticated ? <ExerciseCreate /> : <Navigate to="/login" />}
/>
<Route
  path="/exercises/:id"
  element={isAuthenticated ? <ExerciseDetail /> : <Navigate to="/login" />}
/>
         <Route path="/exercises/suggested" element={<SuggestedExercises />} />
              
  </Routes>
 </Router>
  );
}

export default App;
