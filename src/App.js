import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

export default function App() {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    branch: "",
    totalRB: "",
    rbColln: "",
    totalARR: "",
    arrColln: "",
    totalColln: "",
    bill: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
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

  const parseMessage = (text) => {
    const obj = {};
    const parts = text.split(",");
    parts.forEach((p) => {
      const [key, value] = p.split(":").map((s) => s.trim());
      if (!key || !value) return;
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes("branch")) obj.branch = value;
      if (lowerKey.includes("total rb")) obj.totalRB = Number(value);
      if (lowerKey.includes("rb colln")) obj.rbColln = Number(value);
      if (lowerKey.includes("total arr")) obj.totalARR = Number(value);
      if (lowerKey.includes("arr colln")) obj.arrColln = Number(value);
      if (lowerKey.includes("total colln")) obj.totalColln = Number(value);
      if (lowerKey.includes("bill")) obj.bill = Number(value);
    });
    return obj;
  };

  const addMessageData = () => {
    const parsed = parseMessage(message);
    if (!parsed.branch) return alert("Invalid message format!");
    setRows([...rows, parsed]);
    setMessage("");
    setShowModal(false);
  };

  const addManualData = () => {
    if (!formData.branch) return alert("Branch is required!");
    setRows([...rows, formData]);
    setFormData({
      branch: "",
      totalRB: "",
      rbColln: "",
      totalARR: "",
      arrColln: "",
      totalColln: "",
      bill: "",
    });
    setShowModal(false);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const editRow = (index) => {
    const current = rows[index];
    setMessage(
      `BRANCH : ${current.branch}, TOTAL RB : ${current.totalRB}, RB COLLN: ${current.rbColln}, TOTAL ARR : ${current.totalARR}, ARR COLLN : ${current.arrColln}, TOTAL COLLN : ${current.totalColln}, BILL : ${current.bill}`
    );
    setRows(rows.filter((_, i) => i !== index));
  };

  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const downloadTableImage = async () => {
    if (tableRef.current) {
      // Hide action columns
      const actionElements = tableRef.current.querySelectorAll('.no-print');
      actionElements.forEach(el => el.style.display = 'none');
      
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      // Show action columns back
      actionElements.forEach(el => el.style.display = '');
      
      const link = document.createElement('a');
      link.download = `collection-report-${today.replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 text-gray-900">


      {/* Add Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
        >
          ➕ Add Data
        </button>
      </div>

      {/* Download Button */}
      {rows.length > 0 && (
        <div className="mb-4 text-center">
          <button
            onClick={downloadTableImage}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-semibold"
          >
            📥 Download Table as Image
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {!modalType ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Choose Input Method</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => openModal('text')}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                  >
                    📝 Text Message
                  </button>
                  <button
                    onClick={() => openModal('manual')}
                    className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
                  >
                    ✏️ Manual Entry
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : modalType === 'text' ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Add Using Message</h2>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  placeholder="Paste your message here..."
                  className="w-full border rounded-md p-2 mb-4"
                ></textarea>
                <div className="flex gap-2">
                  <button
                    onClick={addMessageData}
                    className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowModal(false); setModalType(''); }}
                    className="flex-1 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Add Manually</h2>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {Object.keys(formData).map((key) => (
                    <input
                      key={key}
                      type={key === "branch" ? "text" : "number"}
                      placeholder={key.toUpperCase()}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="border p-2 rounded-md w-full"
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addManualData}
                    className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowModal(false); setModalType(''); }}
                    className="flex-1 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto" ref={tableRef}>
        <div className="text-center mb-4 bg-white p-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-40 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold mb-4">
            ARREARS, RUNNING BALANCE & COLLECTION DETAILS
          </h1>
          <h2 className="text-xl font-bold mb-4">
            CALICUT REGION
          </h2>
          <p className="text-red-600 font-bold text-lg">DATE: {today}</p>
        </div>
        <table className="min-w-full border-2 border-black text-center bg-white shadow-lg" style={{borderCollapse: 'collapse', fontSize: '16px'}}>
          <thead>
            <tr className="font-bold bg-white">
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '120px'}}>BRANCH</th>
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '140px'}}>TOTAL RB</th>
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '140px'}}>RB COLLN</th>
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '80px'}}>%</th>
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '140px'}}>TOTAL ARR</th>
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '140px'}}>ARR COLLN</th>
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '80px'}}>%</th>
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '140px'}}>TOTAL COLLN</th>
              <th className="p-3 border border-black text-xl font-bold" style={{backgroundColor: '#FEE2E2', minWidth: '100px'}}>BILL</th>
              <th className="p-4 border border-black text-lg font-bold no-print" style={{backgroundColor: '#FEE2E2', minWidth: '120px'}}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const rbPercent = row.totalRB
                ? ((row.rbColln / row.totalRB) * 100).toFixed(6)
                : "0.000000";
              const arrPercent = row.totalARR
                ? ((row.arrColln / row.totalARR) * 100).toFixed(6)
                : "0.000000";
              
              // Determine if branch should be highlighted (you can customize this logic)
              const highlightedBranches = ['FAROOK', 'KADALUNDI', 'ENGAPUZHA'];
              const isHighlighted = highlightedBranches.includes(row.branch.toUpperCase());
              
              return (
                <tr key={index} className="hover:bg-gray-100">
                  <td className={`border border-black p-3 text-xl font-bold ${isHighlighted ? 'text-red-600' : ''}`}>
                    {row.branch}
                  </td>
                  <td className="border border-black p-3 text-xl font-bold">{Number(row.totalRB).toLocaleString()}</td>
                  <td className="border border-black p-3 text-xl font-bold">{Number(row.rbColln).toLocaleString()}</td>
                  <td className="border border-black p-3 text-xl font-bold">{rbPercent}</td>
                  <td className="border border-black p-3 text-xl font-bold">{Number(row.totalARR).toLocaleString()}</td>
                  <td className="border border-black p-3 text-xl font-bold">{Number(row.arrColln).toLocaleString()}</td>
                  <td className="border border-black p-3 text-xl font-bold">{arrPercent}</td>
                  <td className="border border-black p-3 text-xl font-bold">{Number(row.totalColln).toLocaleString()}</td>
                  <td className="border border-black p-3 text-xl font-bold">{Number(row.bill).toLocaleString()}</td>
                  <td className="border border-black p-3 no-print">
                    <div className="flex flex-col sm:flex-row gap-1 justify-center">
                      <button
                        onClick={() => editRow(index)}
                        className="text-blue-600 hover:underline text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRow(index)}
                        className="text-red-600 hover:underline text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr className="font-bold" style={{backgroundColor: '#FEF3C7'}}>
              <td className="border border-black p-3 text-xl font-bold">TOTAL</td>
              <td className="border border-black p-3 text-xl font-bold">{totals.totalRB.toLocaleString()}</td>
              <td className="border border-black p-3 text-xl font-bold">{totals.rbColln.toLocaleString()}</td>
              <td className="border border-black p-3 text-xl font-bold">
                {totals.totalRB
                  ? ((totals.rbColln / totals.totalRB) * 100).toFixed(7)
                  : "0.0000000"}
              </td>
              <td className="border border-black p-3 text-xl font-bold">{totals.totalARR.toLocaleString()}</td>
              <td className="border border-black p-3 text-xl font-bold">{totals.arrColln.toLocaleString()}</td>
              <td className="border border-black p-3 text-xl font-bold">
                {totals.totalARR
                  ? ((totals.arrColln / totals.totalARR) * 100).toFixed(7)
                  : "0.0000000"}
              </td>
              <td className="border border-black p-3 text-xl font-bold">{totals.totalColln.toLocaleString()}</td>
              <td className="border border-black p-3 text-xl font-bold">{totals.bill.toLocaleString()}</td>
              <td className="border border-black p-4 text-lg font-bold no-print">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
