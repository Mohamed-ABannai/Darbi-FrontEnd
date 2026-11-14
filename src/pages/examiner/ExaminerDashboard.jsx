
import { useEffect, useState } from "react";
import { getDrivingTests } from "../../services/drivingTestService";

function ExaminerDashboard() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExaminerTests() {
      try {
        setLoading(true);
        const data = await getDrivingTests();
        setTests(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load driving tests.");
      } finally {
        setLoading(false);
      }
    }

    fetchExaminerTests();
  }, []);

  const scheduledTests = tests.filter((test) => test.status === "scheduled");
  const completedTests = tests.filter((test) => test.status === "completed");

  if (loading) return <div>Loading examiner dashboard...</div>;

  return (
    <div>
      <h1>Examiner Dashboard</h1>

      {error && <div className="error">{error}</div>}

      <div>Scheduled Tests: {scheduledTests.length}</div>
      <div>Completed Tests: {completedTests.length}</div>

      {tests.length === 0 ? (
        <p>No assigned driving tests found.</p>
      ) : (
        <div>
          {tests.map((test) => (
            <div key={test._id}>
              <div>
                <p><strong>Learner:</strong> {test.Learner?.username || "Candidate"}</p>
                <p><strong>Test Date:</strong> {new Date(test.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {test.status}</p>
                <p><strong>Result:</strong> {test.result}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExaminerDashboard;

