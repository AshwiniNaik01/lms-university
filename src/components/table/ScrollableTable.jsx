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


// import { useState, useMemo, useEffect } from "react";

// const ScrollableTable = ({
//   columns = [],
//   data = [],
//   maxHeight = 500,
//   emptyMessage = "No data available",

//   // Feature toggles
//   enableSearch = true,
//   enableColumnFilters = true,
//   enableColumnHide = true,
//   enableRowSelection = true,
//   enableRowActions = true,
//   enableResizing = true,
//   enableSorting = true,
//   enablePagination = false,

//   pageSize = 10,
// }) => {
//   // --- STATES ---
//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({});
//   const [hiddenCols, setHiddenCols] = useState({});
//   const [selectedRows, setSelectedRows] = useState({});
//   const [sortConfig, setSortConfig] = useState(null);
//   const [page, setPage] = useState(1);
// const [showFilters, setShowFilters] = useState({});



//   const [columnWidths, setColumnWidths] = useState(
//     columns.reduce((acc, col) => {
//       acc[col.accessor] = 180;
//       return acc;
//     }, {})
//   );

//   // -------------------------------------------------------
//   // 🔍 Debounced Search
//   // -------------------------------------------------------
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(search), 300);
//     return () => clearTimeout(timer);
//   }, [search]);

//   // -------------------------------------------------------
//   // 🔎 Column Filters + Global Filter
//   // -------------------------------------------------------
//   const filteredData = useMemo(() => {
//     return data.filter((row) => {
//       const searchMatch =
//         debouncedSearch.trim() === "" ||
//         Object.values(row)
//           .join(" ")
//           .toLowerCase()
//           .includes(debouncedSearch.toLowerCase());

//       const filterMatch = Object.entries(filters).every(([key, value]) => {
//         if (!value) return true;
//         return String(row[key]).toLowerCase().includes(value.toLowerCase());
//       });

//       return searchMatch && filterMatch;
//     });
//   }, [data, debouncedSearch, filters]);

//   // -------------------------------------------------------
//   // 🔽 Sorting
//   // -------------------------------------------------------
//   const sortedData = useMemo(() => {
//     if (!enableSorting || !sortConfig) return filteredData;

//     const { key, direction } = sortConfig;

//     return [...filteredData].sort((a, b) => {
//       if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
//       if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredData, sortConfig]);

//   const handleSort = (accessor) => {
//     if (!enableSorting) return;

//     setSortConfig((prev) => {
//       if (prev?.key === accessor) {
//         return {
//           key: accessor,
//           direction: prev.direction === "asc" ? "desc" : "asc",
//         };
//       }
//       return { key: accessor, direction: "asc" };
//     });
//   };

//   // -------------------------------------------------------
//   // 📄 Pagination
//   // -------------------------------------------------------
//   const paginatedData = useMemo(() => {
//     if (!enablePagination) return sortedData;

//     const start = (page - 1) * pageSize;
//     return sortedData.slice(start, start + pageSize);
//   }, [sortedData, page, enablePagination, pageSize]);

//   const totalPages = Math.ceil(sortedData.length / pageSize);

//   // -------------------------------------------------------
//   // 📏 Column Resizing
//   // -------------------------------------------------------
//   const handleResizeStart = (e, accessor) => {
//     if (!enableResizing) return;

//     const startX = e.clientX;
//     const startWidth = columnWidths[accessor];

//     const onMouseMove = (event) => {
//       const newWidth = startWidth + (event.clientX - startX);
//       setColumnWidths((prev) => ({
//         ...prev,
//         [accessor]: Math.max(120, newWidth),
//       }));
//     };

//     const onMouseUp = () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup", onMouseUp);
//     };

//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup", onMouseUp);
//   };

//   // -------------------------------------------------------
//   // RENDER
//   // -------------------------------------------------------

// return (
//   <div className="w-full bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
    
//     {/* 🔍 GLOBAL SEARCH & CONTROLS */}
//     {(enableSearch || enableColumnHide) && (
//       <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
//         <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
//           {/* Search Bar */}
//           {enableSearch && (
//             <div className="flex-1 w-full lg:max-w-md">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-lg text-purple-500">🔍</span>
//                 </div>
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search across all columns..."
//                   className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Column Controls */}
//           {enableColumnHide && (
//             <div className="flex items-center gap-3">
//               <div className="relative group">
//                 <button className="flex items-center gap-3 px-5 py-3 bg-white border-2 border-purple-200 rounded-2xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-sm">
//                   <span className="text-lg text-purple-600">📊</span>
//                   <span className="text-sm font-semibold text-purple-700">Manage Columns</span>
//                 </button>
                
//                 {/* Column Dropdown */}
//                 <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-30">
//                   <h4 className="text-base font-bold text-purple-800 mb-4 flex items-center gap-2">
//                     <span>👁️</span> Visible Columns
//                   </h4>
//                   <div className="space-y-3 max-h-64 overflow-y-auto">
//                     {columns.map((col) => (
//                       <label key={col.accessor} className="flex items-center gap-4 p-3 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             checked={!hiddenCols[col.accessor]}
//                             onChange={() =>
//                               setHiddenCols((prev) => ({
//                                 ...prev,
//                                 [col.accessor]: !prev[col.accessor],
//                               }))
//                             }
//                             className="w-5 h-5 text-purple-600 bg-purple-100 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                           />
//                         </div>
//                         <span className="text-sm font-medium text-purple-800 flex-1">{col.header}</span>
//                         {enableSorting && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleSort(col.accessor);
//                             }}
//                             className="p-2 hover:bg-purple-200 rounded-xl transition-colors text-purple-600"
//                           >
//                             ↕️
//                           </button>
//                         )}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     )}
    

//     {/* TABLE HEADER */}
//   <div className="sticky top-0   bg-indigo-600 text-white z-20 shadow-lg">

//       <div className="flex">
//         {/* Selection Column */}
//         {enableRowSelection && (
//           <div className="w-16 flex items-center justify-center py-5 border-r border-purple-500">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 className="w-5 h-5 text-purple-600 bg-white border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                 onChange={(e) => {
//                   const allSelected = e.target.checked;
//                   const newSelected = {};
//                   paginatedData.forEach((_, index) => {
//                     newSelected[index] = allSelected;
//                   });
//                   setSelectedRows(newSelected);
//                 }}
//               />
//             </div>
//           </div>
//         )}

//         {/* Data Columns */}
//       {columns.map((col, index) => {
//   if (hiddenCols[col.accessor]) return null;

//   // Find all visible columns
//   const visibleColumns = columns.filter(c => !hiddenCols[c.accessor]);
//   const isLastColumn = visibleColumns[visibleColumns.length - 1].accessor === col.accessor;

//   return (
//     <div
//       key={col.accessor}
//       style={{
//         width: columnWidths[col.accessor],
//         minWidth: columnWidths[col.accessor],
//       }}
//       className={`relative group ${isLastColumn ? '' : 'border-r border-purple-500'} flex-none`}
//     >
//       <div
//         className="flex items-center justify-between px-5 py-5 cursor-pointer hover:bg-blue-500 transition-all duration-300"
//         onClick={() => enableSorting && handleSort(col.accessor)}
//       >
//         <div className="flex items-center gap-3">
//           <span className="text-sm font-bold tracking-wide">{col.header}</span>

//           {/* Sorting Indicator */}
//           {enableSorting && sortConfig?.key === col.accessor && (
//             <span className="text-yellow-300 text-lg">
//               {sortConfig.direction === "asc" ? "⬆️" : "⬇️"}
//             </span>
//           )}
//         </div>

//         {/* Filter Indicator */}
//         {enableColumnFilters && filters[col.accessor] && (
//           <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
//         )}

//         {enableColumnFilters && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // prevent sorting click
//               setShowFilters(prev => ({
//                 ...prev,
//                 [col.accessor]: !prev[col.accessor],
//               }));
//             }}
//             className="ml-2 text-white hover:text-yellow-300 transition"
//           >
//             🔍
//           </button>
//         )}
//       </div>

//       {/* Column Filter */}
//       {enableColumnFilters && showFilters[col.accessor] && (
//         <div className="px-4 pb-4">
//           <div className="relative">
//             <input
//               placeholder={`🔍 ${col.header}`}
//               value={filters[col.accessor] || ''}
//               onChange={(e) =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   [col.accessor]: e.target.value,
//                 }))
//               }
//               className="w-full px-4 py-2 bg-white border-2 border-blue-400 rounded-xl text-sm text-black placeholder-black focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
//             />
//             {filters[col.accessor] && (
//               <button
//                 onClick={() => setFilters(prev => ({ ...prev, [col.accessor]: '' }))}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-300 text-lg"
//               >
//                 ❌
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Resize Handle */}
//       {enableResizing && (
//         <div
//           onMouseDown={(e) => handleResizeStart(e, col.accessor)}
//           className="absolute right-0 top-0 w-2 h-full bg-purple-400 opacity-0 group-hover:opacity-100 cursor-col-resize hover:bg-yellow-400 transition-all duration-300"
//         />
//       )}
//     </div>
//   );
// })}

//         {/* Actions Column */}
//         {/* {enableRowActions && (
//           <div className="flex-1 px-6 py-5 border-purple-500">
//             <span className="text-sm font-bold tracking-wide flex items-center gap-2">
//               <span>⚡</span> Actions
//             </span>
//           </div>
//         )} */}
//       </div>
//     </div>

//     {/* TABLE BODY */}
//     <div style={{ maxHeight }} className="overflow-y-auto bg-gradient-to-b from-white to-purple-50">
//       {paginatedData.map((row, index) => {
//         const selected = !!selectedRows[index];
        
//         return (
//           <div
//             key={index}
//             className={`flex border-b border-purple-100 transition-all duration-300 ${
//               selected 
//                 ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-l-purple-500 shadow-sm' 
//                 : 'hover:bg-gradient-to-r hover:from-white hover:to-purple-50 hover:border-l-4 hover:border-l-purple-300 hover:shadow-md'
//             }`}
//           >
//             {/* Selection Checkbox */}
//             {enableRowSelection && (
//               <div className="w-16 flex items-center justify-center border-r border-purple-100">
//                 <input
//                   type="checkbox"
//                   checked={selected}
//                   onChange={() =>
//                     setSelectedRows((prev) => ({
//                       ...prev,
//                       [index]: !prev[index],
//                     }))
//                   }
//                   className="w-5 h-5 text-purple-600 bg-white border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition-all"
//                 />
//               </div>
//             )}

//             {/* Data Cells */}
//             {columns.map(
//               (col) =>
//                 !hiddenCols[col.accessor] && (
//                   <div
//                     key={col.accessor}
//                     style={{
//                       width: columnWidths[col.accessor],
//                       minWidth: columnWidths[col.accessor],
//                     }}
//                     className="px-5 py-4 border-r border-purple-100"
//                   >
//                     <div className="text-sm text-purple-900 leading-relaxed font-medium">
//                       {typeof col.accessor === "function"
//                         ? col.accessor(row)
//                         : row[col.accessor] || (
//                             <span className="text-purple-400 italic">—</span>
//                           )}
//                     </div>
//                   </div>
//                 )
//             )}

//             {/* Actions Cell */}
//             {/* {enableRowActions && (
//               <div className="flex-1 px-6 py-4 flex items-center justify-end space-x-3">
//                 <button className="p-3 text-purple-600 hover:text-white hover:bg-purple-500 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm">
//                   👁️
//                 </button>
//                 <button className="p-3 text-green-600 hover:text-white hover:bg-green-500 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm">
//                   ✏️
//                 </button>
//                 <button className="p-3 text-red-600 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm">
//                   🗑️
//                 </button>
//               </div>
//             )} */}
//           </div>
//         );
//       })}

//       {/* EMPTY STATE */}
//       {paginatedData.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-white to-purple-50">
//           <div className="w-28 h-28 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
//             <span className="text-4xl">📊</span>
//           </div>
//           <h3 className="text-2xl font-bold text-purple-800 mb-3">No data found</h3>
//           <p className="text-purple-600 text-lg max-w-md">{emptyMessage}</p>
//         </div>
//       )}
//     </div>

//     {/* PAGINATION */}
//     {enablePagination && totalPages > 1 && (
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-200">
//         <div className="text-sm text-purple-700 font-medium">
//           Showing <span className="font-bold text-purple-800">{(page - 1) * pageSize + 1}</span> to{' '}
//           <span className="font-bold text-purple-800">{Math.min(page * pageSize, data.length)}</span> of{' '}
//           <span className="font-bold text-purple-800">{data.length}</span> entries
//         </div>
        
//         <div className="flex items-center gap-3">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="flex items-center gap-2 px-5 py-3 border-2 border-purple-300 rounded-xl text-sm font-semibold text-purple-700 bg-white hover:bg-purple-500 hover:text-white hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
//           >
//             ◀️ Previous
//           </button>

//           <div className="flex items-center gap-2">
//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               const pageNum = i + 1;
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => setPage(pageNum)}
//                   className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm ${
//                     page === pageNum
//                       ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg scale-110'
//                       : 'text-purple-700 bg-white border-2 border-purple-200 hover:bg-purple-500 hover:text-white hover:border-purple-500'
//                   }`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//             {totalPages > 5 && (
//               <span className="px-3 text-purple-500 font-bold">...</span>
//             )}
//           </div>

//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="flex items-center gap-2 px-5 py-3 border-2 border-purple-300 rounded-xl text-sm font-semibold text-purple-700 bg-white hover:bg-purple-500 hover:text-white hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
//           >
//             Next ▶️
//           </button>
//         </div>
//       </div>
//     )}
//   </div>
// );
// };

// export default ScrollableTable;
