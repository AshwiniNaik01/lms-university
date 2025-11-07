
// const ScrollableTable = ({ columns = [], data = [], maxHeight = "600px" }) => {
//   return (
//     <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      
//       {/* Scrollable Container */}
//       <div
//         className="overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100"
//         style={{ maxHeight }}
//       >
//         <table className="min-w-full border-collapse text-sm text-left">
//           {/* Sticky Header */}
//           <thead className="sticky top-0 bg-indigo-50 z-10 shadow-md">
//             <tr>
//               {columns.map((col, index) => (
//                 <th
//                   key={index}
//                   className="px-6 py-4 font-semibold text-indigo-900 text-sm uppercase tracking-wider border-b border-indigo-200"
//                 >
//                   {col.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           {/* Table Body */}
//           <tbody>
//             {data.length > 0 ? (
//               data.map((row, rowIndex) => (
//                 <tr
//                   key={rowIndex}
//                   className={`transition-all duration-300 ${
//                     rowIndex % 2 === 0 ? "bg-white" : "bg-indigo-50"
//                   } hover:bg-indigo-100`}
//                 >
//                   {columns.map((col, colIndex) => (
//                     <td
//                       key={colIndex}
//                       className={`px-6 py-4 whitespace-nowrap ${
//                         colIndex === 0
//                           ? "font-semibold text-indigo-900"
//                           : "font-normal"
//                       }`}
//                     >
//                       {typeof col.accessor === "function"
//                         ? col.accessor(row)
//                         : row[col.accessor]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="px-6 py-8 text-center text-indigo-400 italic"
//                 >
//                   No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ScrollableTable;



const ScrollableTable = ({
  columns = [],
  data = [],
  maxHeight = "600px",
  emptyMessage = "No data available",
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      
      {/* Scrollable Container */}
      <div
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100"
        style={{ maxHeight }}
      >
        <table className="min-w-full border-collapse text-sm text-left">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-indigo-50 z-10 shadow-md">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-4 font-semibold text-indigo-900 text-sm uppercase tracking-wider border-b border-indigo-200"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`transition-all duration-300 ${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-indigo-50"
                  } hover:bg-indigo-100`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap ${
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
                  {emptyMessage}
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
