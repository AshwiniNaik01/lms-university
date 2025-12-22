import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import ScrollableTable from "../../table/ScrollableTable";
import ViewQPPopup from "../../student-course/testSection/ViewQPPopup";
import ResultModal from "../../popupModal/ResultModal";
import ResultQPPopup from "../../popupModal/ResultQPPopup";

const StudentsListForTest = () => {
  const { testId } = useParams();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [selectedQP, setSelectedQP] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedQP, setSelectedQP] = useState(null);


  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await apiClient.get(`/api/iqtest/${testId}`);

        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch IQ test results",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId]);

  const columns = [
    {
      header: "Participate Name",
      accessor: (row) => row.student.fullName,
    },
    // {
    //   header: "Email",
    //   accessor: (row) => row.student.email,
    // },
    {
      header: "Marks",
      accessor: (row) =>
        row.status === -1 ? "Not Attempted" : `${row.marksGained}/${row.totalMarks}`,
    },
    {
      header: "Correct",
      accessor: (row) => (row.status === -1 ? "-" : row.correctAnswers),
    },
    {
      header: "Wrong",
      accessor: (row) => (row.status === -1 ? "-" : row.wrongAnswers),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          {row.status === -1 ? (
            <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs">
              No Result
            </span>
          ) : (
            <>
              <button
                onClick={() =>
                  setSelectedResult({
                    marks: row.marksGained,
                    totalMarks: row.totalMarks,
                    correct: row.correctAnswers,
                    wrong: row.wrongAnswers,
                    passingMarks: row.passingMarks || 0,
                  })
                }
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
              >
                View Result
              </button>

              {/* <button
                onClick={() => setSelectedQP(row)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
              >
                View QP
              </button> */}

              <button
  onClick={() => setSelectedQP(row)}
  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
>
  View QP
</button>

            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="p-6">Loading participates...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Participate Results</h1>

      <ScrollableTable
        columns={columns}
        data={results}
        emptyMessage="No participates found"
      />

      {/* View Question Paper */}
      {/* {selectedQP && (
        <ViewQPPopup
          test={{
            title: selectedQP.title,
            questions: selectedQP.questions,
            attempted: selectedQP.status === -1 ? 0 : 1,
          }}
          onClose={() => setSelectedQP(null)}
        />
      )} */}

      {selectedQP && (
  <ResultQPPopup
    isOpen={!!selectedQP}
    onClose={() => setSelectedQP(null)}
    result={selectedQP}
  />
)}


      {/* View Result */}
      {selectedResult && (
        <ResultModal
          isOpen={!!selectedResult}
          onClose={() => setSelectedResult(null)}
          result={selectedResult}
        />
      )}
    </div>
  );
};

export default StudentsListForTest;

