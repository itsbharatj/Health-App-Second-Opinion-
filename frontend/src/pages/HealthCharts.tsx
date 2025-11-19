
import { FiChevronLeft, FiShare2 } from 'react-icons/fi';

const HealthCharts = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => window.history.back()} className="p-2 rounded-full bg-gray-100">
          <FiChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Health Analytics</h1>
        <button className="p-2 rounded-full bg-gray-100">
          <FiShare2 size={24} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-2">Heart Rate</h2>
            <p className="text-2xl font-bold">78 <span className="text-base font-normal">bpm</span></p>
            {/* Placeholder for chart */}
            <div className="h-32 bg-gray-200 mt-2 rounded"></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-2">Blood Pressure</h2>
            <p className="text-2xl font-bold">120/80 <span className="text-base font-normal">mmHg</span></p>
            <div className="h-32 bg-gray-200 mt-2 rounded"></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-2">Sleep</h2>
            <p className="text-2xl font-bold">7h 30m</p>
            <div className="h-32 bg-gray-200 mt-2 rounded"></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-2">Steps</h2>
            <p className="text-2xl font-bold">8,450</p>
            <div className="h-32 bg-gray-200 mt-2 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCharts;
