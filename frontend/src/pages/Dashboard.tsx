
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HealthJournal from '../components/HealthJournal';
import SleepChart from '../components/SleepChart';
import { geminiService } from '../services/gemini';
import { FiActivity, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    loadHealthInsights();
  }, []);

  const loadHealthInsights = async () => {
    setLoadingInsights(true);
    try {
      const healthData = {
        heartRate: 78,
        bloodPressure: '120/80',
        steps: 8450,
        sleep: 7.5,
        calories: 1850,
        water: 6,
        activity: 'moderate',
      };

      const insightsText = await geminiService.generateHealthInsights(healthData);
      const insightsList = insightsText.split('\n').filter(line => line.trim().length > 0);
      setInsights(insightsList.slice(0, 3));
    } catch (error) {
      console.error('Failed to load health insights:', error);
      setInsights(['Keep up the great work with your daily activities!', 'Remember to stay hydrated throughout the day.']);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="container">
      <div className="top">
        <div className="left">
          <div className="avatar">
            <img src="https://i.pravatar.cc/150?img=3" alt="User Avatar" />
            <div className="status"></div>
          </div>
          <div className="texts">
            <div className="greeting">Hello Gaurav!</div>
            <div className="date">Monday, 3rd Nov</div>
          </div>
        </div>
        <div className="calendar">
          📅
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-200">
        <div className="flex items-start gap-3 mb-3">
          <FiActivity className="text-blue-600 mt-1 flex-shrink-0" size={24} />
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-2">Your Health Insights</h3>
            {loadingInsights ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Getting your personalized insights...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <FiTrendingUp className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Link
          to="/chat"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          💬 Chat with AI for more guidance
        </Link>
      </div>

      <div className="mb-4">
        <HealthJournal />
      </div>

      <div className="quick">
        <div className="title">
          <h3>Quick Links</h3>
          <a href="#" className="seeall">See All</a>
        </div>
        <div className="links">
          <Link to="/documents" className="link">
            <div className="icon">📄</div>
            <div className="label">My Documents</div>
          </Link>
          <Link to="/food-tracking" className="link">
            <div className="icon">🍔</div>
            <div className="label">Meal Updates</div>
          </Link>
          <Link to="/goal-progress" className="link">
            <div className="icon">🎯</div>
            <div className="label">Goal Progress</div>
          </Link>
        </div>
      </div>

      <div className="activity">
        <div className="act-left">🚲</div>
        <div className="act-mid">
          <div className="act-date">02 November</div>
          <div className="act-stats">💧 1282 Kcal  ⚡️ 963 Kcal</div>
        </div>
        <div className="act-arrow">❯</div>
      </div>

      <div className="glance">
        <div className="glance-header">
          <h3>Month at a Glance</h3>
          <div className="month">Nov, 2025</div>
        </div>
        <div className="grid">
          <div className="card">
            <div className="stat">
              <div className="muted">Calories</div>
              <div className="big">620.68</div>
              <div className="unit">Kcal</div>
            </div>
          </div>
          <div className="card sleepcard">
            <div className="stat">
              <div className="muted">Sleep Quality</div>
            </div>
            <div className="sleep-plot">
              <SleepChart />
            </div>
            <Link to="/chat" className="chat">💬</Link>
          </div>
          <div className="card">
            <div className="stat">
              <div className="muted">Steps</div>
              <div className="big">1240</div>
              <div className="unit">Steps</div>
            </div>
          </div>
        </div>
      </div>
      <Link to="/guardians" className="fab">👥</Link>
    </div>
  );
};

export default Dashboard;
