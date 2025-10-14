import React, { useState, useEffect } from 'react';
import { callGeminiVision, findBestMatchingBranch } from '../services/geminiVision';

const ImageProcessor = ({ branches, onDataExtracted, downloadTableImage, shareToWhatsApp }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [showDataContainer, setShowDataContainer] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      if (e.dataTransfer.types.includes('Files')) {
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (!e.relatedTarget || !document.body.contains(e.relatedTarget)) {
        setIsDragOver(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find(file => file.type.startsWith('image/'));
      if (imageFile) {
        processImage(imageFile);
      }
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  const processImage = async (file) => {
    setIsProcessing(true);
    try {
      const result = await callGeminiVision(file);
      
      const bestMatch = findBestMatchingBranch(result.BRANCH, branches);
      
      const processedData = {
        branch: result.BRANCH || '',
        totalRB: result['TOTAL RUNNING BALANCE'] || '',
        rbColln: result['RUNNING BALANCE COLLN'] || '',
        totalARR: result['TOTAL ARRS'] || '',
        arrColln: result['ARREARS COLL'] || '',
        totalColln: result['TOTAL COLL'] || '',
        bill: result.BILL || ''
      };

      setExtractedData(processedData);
      setEditableData(processedData);
      setSelectedBranch(bestMatch || '');
      setShowDataContainer(true);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    processImage(file);
  };

  const handleDataChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyData = () => {
    if (!selectedBranch) {
      alert('Please select a branch');
      return;
    }

    const finalData = {
      ...editableData,
      branch: selectedBranch
    };

    onDataExtracted(finalData);
    setShowDataContainer(false);
    setExtractedData(null);
    setEditableData({});
    setSelectedBranch('');
  };

  const handleCancel = () => {
    setShowDataContainer(false);
    setExtractedData(null);
    setEditableData({});
    setSelectedBranch('');
  };

  return (
    <>
      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="text-center text-white p-12 rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 shadow-2xl">
            <div className="w-24 h-24 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-4xl font-light mb-3 tracking-wide">Drop Image Here</h2>
            <p className="text-lg opacity-90 font-light">Release to process branch collection report</p>
            <div className="mt-6 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="text-center text-white p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="animate-spin w-16 h-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Processing Image</h3>
            <p className="text-sm opacity-90">Extracting data using AI...</p>
          </div>
        </div>
      )}
      
    <div className="mb-6">

      {/* Data Container */}
      {showDataContainer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Extracted Data</h3>
            </div>
            
            {/* Branch Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Branch:</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">-- Select Branch --</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Editable Data Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total RB:</label>
                <input
                  type="text"
                  value={editableData.totalRB || ''}
                  onChange={(e) => handleDataChange('totalRB', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Total Running Balance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">RB Collection:</label>
                <input
                  type="text"
                  value={editableData.rbColln || ''}
                  onChange={(e) => handleDataChange('rbColln', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Running Balance Collection"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Arrears:</label>
                <input
                  type="text"
                  value={editableData.totalARR || ''}
                  onChange={(e) => handleDataChange('totalARR', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Total Arrears"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Arrears Collection:</label>
                <input
                  type="text"
                  value={editableData.arrColln || ''}
                  onChange={(e) => handleDataChange('arrColln', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Arrears Collection"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Collection:</label>
                <input
                  type="text"
                  value={editableData.totalColln || ''}
                  onChange={(e) => handleDataChange('totalColln', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Total Collection"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bill:</label>
                <input
                  type="text"
                  value={editableData.bill || ''}
                  onChange={(e) => handleDataChange('bill', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Bill Amount"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-all duration-200 border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyData}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedBranch}
              >
                Apply Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ImageProcessor;