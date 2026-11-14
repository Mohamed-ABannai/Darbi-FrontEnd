
import { useEffect, useState } from "react";
import { getDrivingTests, submitDrivingTestResult } from "../../services/drivingTestService";

function AssignedTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function fetchAssignedTests() {
      try {
        setLoading(true);
        const data = await getDrivingTests();
        setTests(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load assigned tests.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignedTests();
  }, []);

  async function handleTestResult(testId, result) {
    try {
      setError("");
      setActionMessage("");
      const updatedTest = await submitDrivingTestResult(testId, result);

      setActionMessage(`Test marked as ${result}!`);

      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === testId
            ? { ...test, status: updatedTest.status, result: updatedTest.result, extraHours: updatedTest.extraHours }
            : test
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update test result.");
    }
  }

  if (loading) return <div>Loading assigned tests...</div>;

  return (
    <div>
      <h1>Assigned Tests & Results</h1>

      {error && <div className="error">{error}</div>}
      {actionMessage && <div>{actionMessage}</div>}

      {tests.length === 0 ? (
        <p>No tests found.</p>
      ) : (
        <div>
          {tests.map((test) => (
            <div key={test._id}>
              <div>
                <p><strong>Candidate:</strong> {test.Learner?.username || "Candidate"}</p>
                <p><strong>Date:</strong> {new Date(test.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {test.status}</p>
                <p><strong>Result:</strong> {test.result}</p>
                {test.extraHours > 0 && (
                  <p><strong>Extra Hours Required:</strong> {test.extraHours} hrs</p>
                )}
              </div>

              {test.status === "scheduled" && (
                <div>
                  <button onClick={() => handleTestResult(test._id, "passed")}>
                    Pass
                  </button>
                  <button onClick={() => handleTestResult(test._id, "failed")}>
                    Fail & Add Hours
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssignedTests;

