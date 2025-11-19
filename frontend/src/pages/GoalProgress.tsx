import { FiChevronLeft, FiTarget, FiTrendingUp } from 'react-icons/fi';

const GoalProgress = () => {
  const goals = [
    {
      id: 1,
      name: 'Daily Steps',
      current: 8450,
      target: 10000,
      unit: 'steps',
      icon: '🚶',
      color: 'blue',
    },
    {
      id: 2,
      name: 'Water Intake',
      current: 6,
      target: 8,
      unit: 'glasses',
      icon: '💧',
      color: 'cyan',
    },
    {
      id: 3,
      name: 'Sleep Hours',
      current: 7,
      target: 8,
      unit: 'hours',
      icon: '😴',
      color: 'purple',
    },
    {
      id: 4,
      name: 'Calories Burned',
      current: 450,
      target: 500,
      unit: 'kcal',
      icon: '🔥',
      color: 'orange',
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => window.history.back()} className="p-2 rounded-full bg-gray-100">
          <FiChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Goal Progress</h1>
        <button className="p-2 rounded-full bg-green-100">
          <FiTarget size={24} className="text-green-600" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow-sm mb-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Overall Progress</h2>
            <FiTrendingUp size={28} />
          </div>
          <p className="text-4xl font-bold">78%</p>
          <p className="text-sm opacity-90">Keep up the great work!</p>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{goal.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                      <p className="text-sm text-gray-500">
                        {goal.current} / {goal.target} {goal.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${getProgressColor(progress)} h-3 rounded-full transition-all`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
          <h3 className="font-semibold mb-3 text-gray-800">Weekly Summary</h3>
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div key={idx} className="text-center">
                <p className="text-xs text-gray-500 mb-1">{day}</p>
                <div className={`h-12 rounded ${idx < 5 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;
