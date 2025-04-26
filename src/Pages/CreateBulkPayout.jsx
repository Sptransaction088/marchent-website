import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function BulkUploadComponent() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };
  
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };
  
  const handleFiles = (newFiles) => {
    const updatedFiles = newFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: Math.random() > 0.2 ? 'success' : 'error', // Simulating some failures
    }));
    
    setFiles(prev => [...prev, ...updatedFiles]);
  };
  
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create Bulk</h1>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 mb-6 transition-all 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
          <p className="text-gray-500 mb-4">Support for CSV, XLSX, and XML files</p>
          
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
            <span className="mr-2">+ Create Bulk</span>
            <input type="file" className="hidden" multiple onChange={handleFileSelect} />
          </label>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 py-3 px-4 border-b">
          <h2 className="text-lg font-semibold text-center">File Report</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {files.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500">
              <FileText className="w-12 h-12 mb-2 opacity-60" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            files.map((file, index) => (
              <div key={index} className="py-3 px-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="mr-3">
                    {file.status === 'success' ? (
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                      <AlertCircle className="text-red-500 w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {file.status === 'success' ? 'Processed' : 'Failed'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))
          )}
        </div>
        
        {files.length > 0 && (
          <div className="bg-gray-50 py-3 px-4 border-t flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Process All Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}