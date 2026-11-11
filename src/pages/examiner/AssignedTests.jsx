import { useEffect, useState } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService";

function AssignedTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function fetchAssignedTests() {
      try {
        setLoading(true);
        const data = await getTrainingPlans();
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
      setActionMessage(`Test marked as ${result}!`);
      
      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === testId ? { ...test, testStatus: result } : test
        )
      );
    } catch (err) {
      setError("Failed to update test result." + err);
    }
  }

  if (loading) return <div>Loading assigned tests...</div>;

  return (
    <div>
      <h1>Assigned Tests & Results</h1>

      {error && <div>{error}</div>}
      {actionMessage && <div>{actionMessage}</div>}

      {tests.length === 0 ? (
        <p>No tests found.</p>
      ) : (
        <div>
          {tests.map((test) => (
            <div key={test._id}>
              <div>
                <p><strong>Candidate:</strong> {test.learner?.username || test.learner?.name || "Candidate"}</p>
                <p><strong>Status:</strong> {test.testStatus || "Pending"}</p>
              </div>

              <div>
                <button onClick={() => handleTestResult(test._id, "Passed")}>
                  Pass
                </button>
                <button onClick={() => handleTestResult(test._id, "Failed - Needs Extra Hours")}>
                  Fail & Add Hours
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssignedTests;