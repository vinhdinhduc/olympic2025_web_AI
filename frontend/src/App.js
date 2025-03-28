import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
import {useEffect,useState} from 'react'
import Register from './Pages/register';
import Login from './Pages/login';
import Dashboard from './Pages/dashboard';
import ExerciseList from './components/ExerciseList';
import ExerciseCreate from './components/ExerciseCreate';
import QuizPage from "./Pages/QuizPage";
import Profile from './Pages/Profile';
import Home from './Pages/Home';
import SuggestedExercises from "./Pages/SuggestedExercises";
import SubmitExercise from "./Pages/SubmitExercise";
import ExplainProblem from "./Pages/ExplainProblem";

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
        <Route path="/exercise/:id" element={<QuizPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
         <Route path="/exercises/create" element={<ExerciseCreate />} />
         <Route path="/exercises/suggested" element={<SuggestedExercises />} />
                <Route path="/exercises/submit" element={<SubmitExercise />} />
                <Route path="/problems/explain" element={<ExplainProblem />} />
  </Routes>
 </Router>
  );
}

export default App;
