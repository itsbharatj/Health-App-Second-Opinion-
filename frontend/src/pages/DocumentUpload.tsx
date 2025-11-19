import { useState, useRef, useEffect } from 'react';
import { FiFilePlus, FiFilter, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/gemini';
import { storage } from '../services/storage';

const DocumentUpload = () => {
  const [documents, setDocuments] = useState(storage.getDocuments());
  const [uploading, setUploading] = useState(false);
  const [processingDoc, setProcessingDoc] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    storage.saveDocuments(documents);
  }, [documents]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const newDocId = documents.length + 1;
    const newDoc = {
      id: newDocId,
      name: file.name,
      date: new Date().toLocaleDateString(),
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('text') ? 'txt' : 'doc',
      summary: '',
    };
    
    setDocuments([newDoc, ...documents]);
    setUploading(false);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      
      setProcessingDoc(newDocId);
      try {
        const summary = await geminiService.processDocument(content, file.name);
        setDocuments(prev => prev.map(doc => 
          doc.id === newDocId ? { ...doc, summary } : doc
        ));
      } catch (error) {
        console.error('Failed to process document:', error);
      } finally {
        setProcessingDoc(null);
      }
    };
    
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => window.history.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">My Documents</h1>
        <button>
          <FiFilter size={22} className="text-gray-700" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 flex items-start gap-3">
          <FiMessageSquare className="text-blue-600 mt-1" size={20} />
          <div>
            <p className="text-sm font-semibold text-blue-800">Chat with your documents</p>
            <p className="text-xs text-blue-600 mt-1">Upload PDFs and ask questions about them using our AI chat</p>
            <Link to="/chat" className="text-xs font-semibold text-blue-700 underline mt-2 inline-block">
              Go to Chat →
            </Link>
          </div>
        </div>

        {uploading && (
          <div className="flex items-center justify-center p-4 mb-3 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-600">Uploading document...</span>
          </div>
        )}

        {documents.map((doc) => (
          <div key={doc.id} className="mb-3 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center flex-1">
                <div className="p-3 mr-4 text-red-500 bg-red-100 rounded-lg">
                  <p className="font-bold text-xs">PDF</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.date}</p>
                  {processingDoc === doc.id && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span className="text-xs text-blue-600">Processing with AI...</span>
                    </div>
                  )}
                </div>
              </div>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            {doc.summary && (
              <div className="px-3 pb-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-1">AI Summary:</p>
                <p className="text-sm text-gray-700">{doc.summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="w-full flex items-center justify-center p-4 text-white bg-green-500 rounded-lg cursor-pointer hover:bg-green-600 transition"
        >
          <FiFilePlus size={22} className="mr-2" />
          <span>Upload New Document</span>
        </label>
      </div>
    </div>
  );
};

export default DocumentUpload;
