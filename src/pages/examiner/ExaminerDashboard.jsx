import { useEffect, useState } from "react";
// get trining plansimport { getTrainingPlans } from "../../services/trainingPlanService"; 
import { getTrainingPlans } from "../../services/trainingPlanService"; 
function ExaminerDashboard() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExaminerTests() {
      try {
        setLoading(true);
        const data = await getTrainingPlans();
        setTests(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load driving tests.");
      } finally {
        setLoading(false);
      }
    }

    fetchExaminerTests();
  }, []);

  if (loading) return <div>Loading examiner dashboard...</div>;

  return (
    <div>
      <h1>Examiner Dashboard</h1>

      {error && <div>{error}</div>}

      {tests.length === 0 ? (
        <p>No assigned driving tests found.</p>
      ) : (
        <div>
          {tests.map((test) => (
            <div key={test._id}>
              <div>
                <p><strong>Learner:</strong> {test.learner?.username || test.learner?.name || "Candidate"}</p>
                <p><strong>Test Date:</strong> {test.testDate ? new Date(test.testDate).toLocaleString() : "Scheduled"}</p>
                <p><strong>Status:</strong> {test.testStatus || "Pending Test"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExaminerDashboard;