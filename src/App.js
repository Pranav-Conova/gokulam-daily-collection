import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

export default function App() {
  // Pre-populate branches from the image
  const initialBranches = [
    "FAROOK",
    "KADALUNDI",
    "RAMANATTUKARA",
    "MANANCHIRA",
    "NADAKKAVU",
    "MEDICAL COLLEGE",
    "MUKKAM",
    "KUNNAMANGALAM",
    "MAVOOR ROAD",
    "NARIKKUNI",
    "KALLAI",
    "ENGAPUZHA",
    "THIRUVAMBADI"
  ];

  const [rows, setRows] = useState(() => 
    initialBranches.map(branch => ({
      branch,
      totalRB: "",
      rbColln: "",
      totalARR: "",
      arrColln: "",
      totalColln: "",
      bill: "",
    }))
  );
  const [editingCell, setEditingCell] = useState(null); // {rowIndex, field}
  const tableRef = useRef();

  const today = new Date().toLocaleDateString("en-GB");

  // Function to calculate totals
  const totals = rows.reduce(
    (acc, row) => {
      acc.totalRB += Number(row.totalRB) || 0;
      acc.rbColln += Number(row.rbColln) || 0;
      acc.totalARR += Number(row.totalARR) || 0;
      acc.arrColln += Number(row.arrColln) || 0;
      acc.totalColln += Number(row.totalColln) || 0;
      acc.bill += Number(row.bill) || 0;
      return acc;
    },
    { totalRB: 0, rbColln: 0, totalARR: 0, arrColln: 0, totalColln: 0, bill: 0 }
  );

  // Handle cell click to enable editing
  const handleCellClick = (rowIndex, field) => {
    setEditingCell({ rowIndex, field });
  };

  // Handle cell value change
  const handleCellChange = (rowIndex, field, value) => {
    const newRows = [...rows];
    newRows[rowIndex][field] = value;
    setRows(newRows);
  };

  // Handle cell blur (finish editing)
  const handleCellBlur = () => {
    setEditingCell(null);
  };

  // Handle Enter key to finish editing
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setEditingCell(null);
    }
  };

  const downloadTableImage = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `collection-report-${today.replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const shareToWhatsApp = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], `collection-report-${today.replace(/\//g, '-')}.png`, { type: 'image/png' });
        
        // Check if Web Share API is available and supports files
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'Collection Report',
            text: `Collection Report - ${today}`
          }).catch((error) => {
            console.log('Error sharing:', error);
          });
        } else {
          // For desktop browsers, create a temporary download link and open WhatsApp Web
          const imageUrl = canvas.toDataURL('image/png');
          
          // Store image in localStorage temporarily
          try {
            localStorage.setItem('whatsappImage', imageUrl);
          } catch (e) {
            console.log('Could not store image');
          }
          
          // Open WhatsApp Web with message
          const message = encodeURIComponent(`Collection Report - ${today}`);
          const whatsappUrl = `https://web.whatsapp.com/send?text=${message}`;
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          
          // Also trigger download so user can manually attach
          const link = document.createElement('a');
          link.download = `collection-report-${today.replace(/\//g, '-')}.png`;
          link.href = imageUrl;
          link.click();
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 text-gray-900">
      {/* Download and Share Buttons */}
      <div className="mb-4 text-center flex justify-center gap-4">
        <button
          onClick={downloadTableImage}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-semibold flex items-center gap-2"
        >
          📥 Download Table as Image
        </button>
        <button
          onClick={shareToWhatsApp}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Share to WhatsApp
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex justify-center">
        <div ref={tableRef} className="inline-block bg-white p-6">
          <div className="text-center mb-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-32 mx-auto mb-4"
            />
            <h1 className="text-xl font-bold mb-3">
              ARREARS, RUNNING BALANCE & COLLECTION DETAILS
            </h1>
            <h2 className="text-lg font-bold mb-3">
              CALICUT REGION
            </h2>
            <p className="text-red-600 font-bold text-base">DATE: {today}</p>
          </div>
          <table className="border-2 border-black text-center bg-white shadow-lg mx-auto" style={{borderCollapse: 'collapse', fontSize: '15px', width: 'auto'}}>
          <thead>
            <tr className="font-bold bg-white">
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '140px', verticalAlign: 'middle'}}>BRANCH</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px', verticalAlign: 'middle'}}>TOTAL RB</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px', verticalAlign: 'middle'}}>RB COLLN</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '80px', verticalAlign: 'middle'}}>%</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px', verticalAlign: 'middle'}}>TOTAL ARR</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px', verticalAlign: 'middle'}}>ARR COLLN</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '80px', verticalAlign: 'middle'}}>%</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px', verticalAlign: 'middle'}}>TOTAL COLLN</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '110px', verticalAlign: 'middle'}}>BILL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const rbPercent = row.totalRB && row.rbColln
                ? ((row.rbColln / row.totalRB) * 100).toFixed(6)
                : "";
              const arrPercent = row.totalARR && row.arrColln
                ? ((row.arrColln / row.totalARR) * 100).toFixed(6)
                : "";
              
              const renderEditableCell = (field) => {
                const isEditing = editingCell?.rowIndex === index && editingCell?.field === field;
                const displayValue = row[field] ? Number(row[field]).toLocaleString() : '';
                
                return (
                  <td 
                    key={field}
                    className="border border-black p-2 text-base font-bold cursor-pointer hover:bg-blue-50"
                    onClick={() => handleCellClick(index, field)}
                    style={{ position: 'relative', verticalAlign: 'middle' }}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        inputMode="decimal"
                        value={row[field]}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numbers and empty string
                          if (value === '' || /^\d+$/.test(value)) {
                            handleCellChange(index, field, value);
                          }
                        }}
                        onBlur={handleCellBlur}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingCell(null);
                            e.preventDefault();
                          }
                        }}
                        className="text-center text-base font-bold border-0 outline-none bg-transparent"
                        autoFocus
                        style={{ 
                          caretColor: '#000',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '100%',
                          height: '100%',
                          padding: '8px'
                        }}
                      />
                    ) : (
                      <span>{displayValue}</span>
                    )}
                  </td>
                );
              };
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-black p-2 text-base font-bold text-red-600" style={{ verticalAlign: 'middle' }}>
                    {row.branch}
                  </td>
                  {renderEditableCell('totalRB')}
                  {renderEditableCell('rbColln')}
                  <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>{rbPercent}</td>
                  {renderEditableCell('totalARR')}
                  {renderEditableCell('arrColln')}
                  <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>{arrPercent}</td>
                  {renderEditableCell('totalColln')}
                  {renderEditableCell('bill')}
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr className="font-bold" style={{backgroundColor: '#FEF3C7'}}>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>TOTAL</td>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>{totals.totalRB.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>{totals.rbColln.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>
                {totals.totalRB
                  ? ((totals.rbColln / totals.totalRB) * 100).toFixed(6)
                  : ""}
              </td>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>{totals.totalARR.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>{totals.arrColln.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>
                {totals.totalARR
                  ? ((totals.arrColln / totals.totalARR) * 100).toFixed(6)
                  : ""}
              </td>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>{totals.totalColln.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold" style={{ verticalAlign: 'middle' }}>{totals.bill.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
