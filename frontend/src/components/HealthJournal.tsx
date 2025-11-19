import { useState, useEffect } from 'react';
import { FiCalendar, FiEdit2, FiSmile, FiMeh, FiFrown } from 'react-icons/fi';
import { storage } from '../services/storage';

interface JournalEntry {
  id: number;
  date: string;
  mood: 'good' | 'okay' | 'poor';
  activities: string;
  notes: string;
  sleep: number;
  energy: number;
}

const HealthJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<JournalEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    mood: 'good',
    activities: '',
    notes: '',
    sleep: 7,
    energy: 5,
  });

  useEffect(() => {
    setEntries(storage.getJournalEntries());
  }, []);

  const handleAddEntry = () => {
    if (!newEntry.activities) {
      alert('Please add at least one activity');
      return;
    }

    const entry: JournalEntry = {
      id: Date.now(),
      ...newEntry,
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    storage.saveJournalEntries(updatedEntries);
    setShowAddModal(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      mood: 'good',
      activities: '',
      notes: '',
      sleep: 7,
      energy: 5,
    });
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'good':
        return <FiSmile className="text-green-500" size={20} />;
      case 'okay':
        return <FiMeh className="text-yellow-500" size={20} />;
      case 'poor':
        return <FiFrown className="text-red-500" size={20} />;
      default:
        return <FiSmile className="text-green-500" size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Daily Health Journal</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm"
        >
          <FiEdit2 size={16} /> Add Entry
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No journal entries yet. Start logging your daily health!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" size={16} />
                  <span className="text-sm font-semibold text-gray-700">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {getMoodIcon(entry.mood)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-700"><strong>Activities:</strong> {entry.activities}</p>
                {entry.notes && <p className="text-sm text-gray-600 italic">{entry.notes}</p>}
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>Sleep: {entry.sleep}h</span>
                  <span>Energy: {entry.energy}/10</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Add Journal Entry</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How are you feeling?</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewEntry({ ...newEntry, mood: 'good' })}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
                      newEntry.mood === 'good' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <FiSmile className={newEntry.mood === 'good' ? 'text-green-500' : 'text-gray-400'} />
                    <span className="text-sm">Good</span>
                  </button>
                  <button
                    onClick={() => setNewEntry({ ...newEntry, mood: 'okay' })}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
                      newEntry.mood === 'okay' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                    }`}
                  >
                    <FiMeh className={newEntry.mood === 'okay' ? 'text-yellow-500' : 'text-gray-400'} />
                    <span className="text-sm">Okay</span>
                  </button>
                  <button
                    onClick={() => setNewEntry({ ...newEntry, mood: 'poor' })}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
                      newEntry.mood === 'poor' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <FiFrown className={newEntry.mood === 'poor' ? 'text-red-500' : 'text-gray-400'} />
                    <span className="text-sm">Poor</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activities</label>
                <input
                  type="text"
                  value={newEntry.activities}
                  onChange={(e) => setNewEntry({ ...newEntry, activities: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Walking, Yoga, Reading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="How are you feeling? Any observations?"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sleep (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={newEntry.sleep}
                    onChange={(e) => setNewEntry({ ...newEntry, sleep: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Energy (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newEntry.energy}
                    onChange={(e) => setNewEntry({ ...newEntry, energy: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddEntry}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Entry
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewEntry({
                      date: new Date().toISOString().split('T')[0],
                      mood: 'good',
                      activities: '',
                      notes: '',
                      sleep: 7,
                      energy: 5,
                    });
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
    </div>
  );
};

export default HealthJournal;
