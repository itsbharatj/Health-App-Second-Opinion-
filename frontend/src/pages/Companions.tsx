
import { useState, useEffect } from 'react';
import { FiChevronLeft, FiUserPlus } from 'react-icons/fi';
import { storage } from '../services/storage';

const Companions = () => {
  const [companions, setCompanions] = useState(storage.getCompanions());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompanion, setNewCompanion] = useState({
    name: '',
    relation: '',
  });

  useEffect(() => {
    storage.saveCompanions(companions);
  }, [companions]);

  const toggleCompanion = (id: number) => {
    setCompanions(
      companions.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleAddCompanion = () => {
    if (!newCompanion.name || !newCompanion.relation) {
      alert('Please enter both name and relation');
      return;
    }

    const companion = {
      id: companions.length + 1,
      name: newCompanion.name,
      relation: newCompanion.relation,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      enabled: true,
    };

    setCompanions([...companions, companion]);
    setShowAddModal(false);
    setNewCompanion({ name: '', relation: '' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => window.history.back()} className="p-2 rounded-full bg-gray-100">
          <FiChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">My Companions</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-2 rounded-full bg-gray-100"
        >
          <FiUserPlus size={24} className="text-gray-700" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {companions.map((companion) => (
          <div key={companion.id} className="flex items-center justify-between p-3 mb-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <img src={companion.avatar} alt={companion.name} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-semibold text-gray-800">{companion.name}</p>
                <p className="text-sm text-gray-500">{companion.relation}</p>
              </div>
            </div>
            <label htmlFor={`toggle-${companion.id}`} className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  id={`toggle-${companion.id}`}
                  type="checkbox"
                  className="sr-only"
                  checked={companion.enabled}
                  onChange={() => toggleCompanion(companion.id)}
                />
                <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${companion.enabled ? 'transform translate-x-6 bg-green-500' : ''}`}></div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Add Companion</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newCompanion.name}
                  onChange={(e) => setNewCompanion({ ...newCompanion, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                <select
                  value={newCompanion.relation}
                  onChange={(e) => setNewCompanion({ ...newCompanion, relation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select relation</option>
                  <option value="Family">Family</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Friend">Friend</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Trainer">Trainer</option>
                  <option value="Caregiver">Caregiver</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddCompanion}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCompanion({ name: '', relation: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-24 bg-gradient-to-t from-green-100 to-transparent" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, margin: '0 auto', maxWidth: '390px' }}></div>
    </div>
  );
};

export default Companions;
