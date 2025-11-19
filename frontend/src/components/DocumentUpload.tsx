import React, { useState } from 'react';
import { documentsApi } from '../services/api';
import { MedicalDocument } from '../types';
import { FiUpload, FiFile } from 'react-icons/fi';

interface DocumentUploadProps {
  userId: string;
  documents: MedicalDocument[];
  onDocumentAdded: (doc: MedicalDocument) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ userId, documents, onDocumentAdded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await documentsApi.upload(userId, file);
      const newDoc: MedicalDocument = {
        document_id: response.data.document_id,
        user_id: userId,
        document_type: 'medical_document',
        file_name: file.name,
        uploaded_at: new Date().toISOString(),
        analysis: response.data.analysis,
      };
      onDocumentAdded(newDoc);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="bg-secondary rounded-lg p-4 border-2 border-dashed border-slate-600">
      <div className="text-center">
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 hover:opacity-80 transition">
            <FiUpload size={32} className="text-accent" />
            <div>
              <p className="font-semibold text-sm">Upload Medical Documents</p>
              <p className="text-xs text-slate-400">PDF, JPG, PNG, or TXT</p>
              <p className="text-xs text-slate-500 mt-1">
                {uploading ? 'Uploading...' : 'Click to select a file'}
              </p>
            </div>
          </div>
        </label>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold mb-3">Uploaded Documents</h4>
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.document_id} className="bg-slate-700 p-3 rounded text-sm">
                <div className="flex items-start gap-2">
                  <FiFile size={16} className="text-accent mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{doc.file_name}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    {doc.analysis && doc.analysis.summary && (
                      <div className="mt-2 text-xs bg-slate-600 p-2 rounded">
                        <p className="text-slate-300">{doc.analysis.summary}</p>
                        {doc.analysis.extracted_conditions && doc.analysis.extracted_conditions.length > 0 && (
                          <p className="text-accent mt-1">
                            Conditions found: {doc.analysis.extracted_conditions.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
