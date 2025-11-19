import React from 'react';
import { Guardian } from '../types';
import { FiUsers, FiEye, FiAlertCircle } from 'react-icons/fi';

interface GuardianViewProps {
  guardians: Guardian[];
  onAddGuardian: (name: string, relationship: string) => void;
}

export const GuardianView: React.FC<GuardianViewProps> = ({ guardians, onAddGuardian }) => {
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', relationship: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.relationship) {
      onAddGuardian(formData.name, formData.relationship);
      setFormData({ name: '', relationship: '' });
      setShowForm(false);
    }
  };

  const accessLevelIcons = {
    view_all: <FiEye className="text-green-500" />,
    view_alerts: <FiAlertCircle className="text-yellow-500" />,
    view_basic: <FiUsers className="text-blue-500" />,
  };

  return (
    <div className="bg-secondary rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <FiUsers className="text-accent" /> Guardians & Family
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs bg-accent hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          {showForm ? 'Cancel' : '+ Add Guardian'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-slate-700 rounded space-y-2">
          <input
            type="text"
            placeholder="Guardian Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-600 text-white placeholder-slate-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="text"
            placeholder="Relationship (e.g., Son, Daughter, Spouse)"
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full bg-slate-600 text-white placeholder-slate-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="w-full bg-accent hover:bg-blue-600 text-white font-semibold py-1 rounded text-sm"
          >
            Add Guardian
          </button>
        </form>
      )}

      {guardians.length > 0 ? (
        <div className="space-y-2">
          {guardians.map((guardian) => (
            <div key={guardian.guardian_id} className="bg-slate-700 p-3 rounded flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-sm">{guardian.name}</p>
                <p className="text-xs text-slate-400">{guardian.relationship}</p>
                <p className="text-xs text-slate-500 mt-1">Access: {guardian.access_level.replace('_', ' ')}</p>
              </div>
              <div className="mt-1">
                {accessLevelIcons[guardian.access_level]}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No guardians added yet. Add family members to share your health data.</p>
      )}

      <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded border border-blue-700 text-xs">
        <p className="text-blue-200">
          💡 <strong>Tip:</strong> Guardians receive alerts if your vital signs show concerning patterns.
        </p>
      </div>
    </div>
  );
};
