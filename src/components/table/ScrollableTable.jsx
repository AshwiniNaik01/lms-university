

import React from "react";

const ScrollableTable = ({ columns = [], data = [], maxHeight = "600px" }) => {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg border-2 border-indigo-300 overflow-hidden">
      {/* Scrollable container */}
      <div
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100"
        style={{ maxHeight }}
      >
        <table className="w-full border-collapse text-sm text-left min-w-full">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-indigo-50 text-indigo-900 z-10 shadow-sm">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-4 font-semibold text-sm uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-indigo-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-indigo-50"
                  } hover:bg-indigo-100 transition-colors duration-300`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 text-indigo-700 whitespace-nowrap ${
                        colIndex === 0
                          ? "font-semibold text-indigo-900"
                          : "font-normal"
                      }`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-indigo-400 italic"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScrollableTable;
