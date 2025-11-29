import { FaDownload, FaEye, FaFileAlt } from "react-icons/fa";
import { DIR } from "../../utils/constants";

// const NotesTab = ({ course }) => (
//   <div className="bg-white rounded-lg shadow-sm border">
//     <div className="p-6 border-b">
//       <h2 className="text-2xl font-bold text-gray-900">Course Notes</h2>
//       <p className="text-gray-600 mt-1">Download and study course materials</p>
//     </div>

//     <div className="p-6">
//       {course.notes && course.notes.length > 0 ? (
//         <div className="grid gap-4">
//           {course.notes.map((note, index) => (
//             <div
//               key={note._id}
//               className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
//                   <FaFileAlt className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900">
//                     {note.title || `Note ${index + 1}`}
//                   </h4>
//                   {note.content && (
//                     <p className="text-sm text-gray-600 line-clamp-2">
//                       {note.content}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {note.file && (
//                 <a
//                   href={`${DIR.COURSE_NOTES}${note.file}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                   download
//                 >
//                   <FaDownload className="w-4 h-4" />
//                   Download
//                 </a>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 text-gray-500">
//           <FaFileAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//           <p>No notes available for this course yet.</p>
//         </div>
//       )}
//     </div>
//   </div>
// );


const NotesTab = ({ course }) => {
  const allNotes =
    course?.phases
      ?.flatMap(p => p.weeks || [])
      .flatMap(w => w.chapters || [])
      .flatMap(c => c.notes || []) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Course Notes</h2>
        <p className="text-gray-600 mt-1">Download and study course materials</p>
      </div>

      <div className="p-6">
        {allNotes.length > 0 ? (
          <div className="grid gap-4">
            {allNotes.map((note, index) => (
              <div key={note._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{note.title || `Note ${index + 1}`}</h4>
                    {note.content && (
                      <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                    )}
                  </div>
                </div>

                {note.file && (
                  <a
                    href={`${DIR.COURSE_NOTES}${note.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                    download
                  >
                    {/* <FaDownload className="w-4 h-4" /> */}
                    <FaEye className="w-4 h-4" />
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FaFileAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No notes available for this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default NotesTab;