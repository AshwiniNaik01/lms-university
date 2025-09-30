import { BASE_URL } from "../../utils/constants";

const NoteComponent = ({ note }) => (
  <div
    key={note._id}
    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h5 className="font-medium text-gray-900 text-sm mb-1">{note.title}</h5>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          {note.duration && <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">⏱️ {note.duration}</span>}
        </div>
        {note.content && <p className="text-xs text-gray-600 line-clamp-2">{note.content}</p>}
      </div>
      {note.file && (
        <a
          href={`${BASE_URL}/uploads/course-notes/${note.file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200"
        >
          📄 View
        </a>
      )}
    </div>
  </div>
);

export default NoteComponent;