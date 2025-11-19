import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/Chat';
import DocumentUploadPage from './pages/DocumentUpload';
import Companions from './pages/Companions';
import HealthChartsPage from './pages/HealthCharts';
import FoodTracking from './pages/FoodTracking';
import GoalProgress from './pages/GoalProgress';
import './App.css';
import '../main_fixed.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/documents" element={<DocumentUploadPage />} />
        <Route path="/guardians" element={<Companions />} />
        <Route path="/health" element={<HealthChartsPage />} />
        <Route path="/food-tracking" element={<FoodTracking />} />
        <Route path="/goal-progress" element={<GoalProgress />} />
      </Routes>
    </Router>
  );
}

export default App;
