// src/SalesHistory.jsx
import React, { useRef } from "react";

export default function SalesHistory({ sales = [], onBack }) {
  const historyRef = useRef(null);

  const handlePrint = () => {
    const printContents = historyRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>Sales History</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h2 {
              text-align: center;
              font-size: 28px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              border: 1px solid #333;
              text-align: left;
            }
            th {
              background: #f0f0f0;
            }
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
              body {
                margin: 0;
              }
              table {
                page-break-after: auto;
              }
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
              td, th {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          <h2>Sales History</h2>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const buttonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
  };

  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ color: "white", fontSize: "32px", marginBottom: "16px" }}>
        Sales History
      </h2>
      <div style={{ marginBottom: 12, display: "flex", gap: "8px" }}>
        <button
          onClick={onBack}
          style={{ ...buttonStyle, background: "black" }}
        >
          ⬅ Back
        </button>
        <button
          onClick={handlePrint}
          style={{ ...buttonStyle, background: "red" }}
        >
          🖨 Print
        </button>
      </div>

      <div ref={historyRef}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
              <th style={{ padding: 8 }}>Date</th>
              <th style={{ padding: 8 }}>Items</th>
              <th style={{ padding: 8 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: 12, color: "#aaa" }}>
                  No sales yet
                </td>
              </tr>
            )}
            {sales.map((sale) => (
              <tr key={sale.id} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: 8 }}>{sale.date}</td>
                <td style={{ padding: 8 }}>
                  {sale.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                </td>
                <td style={{ padding: 8 }}>{`₹${Number(sale.total).toFixed(2)}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
