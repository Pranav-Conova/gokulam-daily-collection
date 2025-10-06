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

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 text-gray-900">
      {/* Download Button */}
      <div className="mb-4 text-center">
        <button
          onClick={downloadTableImage}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-semibold"
        >
          📥 Download Table as Image
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" ref={tableRef}>
        <div className="text-center mb-3 bg-white p-4 mx-4">
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
        <table className="border-2 border-black text-center bg-white shadow-lg mx-auto mb-4" style={{borderCollapse: 'collapse', fontSize: '15px', width: 'auto'}}>
          <thead>
            <tr className="font-bold bg-white">
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '140px'}}>BRANCH</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px'}}>TOTAL RB</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px'}}>RB COLLN</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '80px'}}>%</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px'}}>TOTAL ARR</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px'}}>ARR COLLN</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '80px'}}>%</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '150px'}}>TOTAL COLLN</th>
              <th className="p-2 border border-black text-base font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '110px'}}>BILL</th>
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
                    style={{ position: 'relative' }}
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
                  <td className="border border-black p-2 text-base font-bold text-red-600">
                    {row.branch}
                  </td>
                  {renderEditableCell('totalRB')}
                  {renderEditableCell('rbColln')}
                  <td className="border border-black p-2 text-base font-bold">{rbPercent}</td>
                  {renderEditableCell('totalARR')}
                  {renderEditableCell('arrColln')}
                  <td className="border border-black p-2 text-base font-bold">{arrPercent}</td>
                  {renderEditableCell('totalColln')}
                  {renderEditableCell('bill')}
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr className="font-bold" style={{backgroundColor: '#FEF3C7'}}>
              <td className="border border-black p-2 text-base font-bold">TOTAL</td>
              <td className="border border-black p-2 text-base font-bold">{totals.totalRB.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold">{totals.rbColln.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold">
                {totals.totalRB
                  ? ((totals.rbColln / totals.totalRB) * 100).toFixed(6)
                  : ""}
              </td>
              <td className="border border-black p-2 text-base font-bold">{totals.totalARR.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold">{totals.arrColln.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold">
                {totals.totalARR
                  ? ((totals.arrColln / totals.totalARR) * 100).toFixed(6)
                  : ""}
              </td>
              <td className="border border-black p-2 text-base font-bold">{totals.totalColln.toLocaleString()}</td>
              <td className="border border-black p-2 text-base font-bold">{totals.bill.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
