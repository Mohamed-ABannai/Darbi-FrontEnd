import { useState, useEffect } from "react";
import { getDrivingTests, scheduleDrivingTest } from "../../services/drivingTestService";
import { getUsers } from "../../services/userService";

function getDateTimeLocalMinimum() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function ManageDrivingTests() {
  const [drivingTests, setDrivingTests] = useState([]);
  const [examiners, setExaminers] = useState([]);
  const [formData, setFormData] = useState({
    testId: "",
    examiner: "",
    date: ""
  });
  const [error, setError] = useState("");

  async function getData() {
    try {
      const testsResponse = await getDrivingTests();
      const usersResponse = await getUsers();
      setDrivingTests(testsResponse);
      setExaminers(usersResponse.filter((user) => user.role === "examiner" && user.isActive));
    } catch {
      setError("Failed to load driving tests");
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([getDrivingTests(), getUsers()]).then(([testsResponse, usersResponse]) => {
      if (!active) return;
      setDrivingTests(testsResponse);
      setExaminers(usersResponse.filter((user) => user.role === "examiner" && user.isActive));
    }).catch(() => {
      if (active) setError("Failed to load driving tests");
    });
    return () => { active = false; };
  }, []);

  function handleChange(event) {
    setFormData({...formData,[event.target.name]: event.target.value});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const testDate = new Date(formData.date);
      if (Number.isNaN(testDate.getTime()) || testDate <= new Date()) {
        setError("Choose a future test date and time.");
        return;
      }
      await scheduleDrivingTest(formData.testId, formData.examiner, testDate.toISOString());
      setFormData({ testId: "", examiner: "", date: "" });
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule driving test");
    }
  }

  return (
    <div className="manage-tests-page admin-table-page">
      <div className="page-heading"><span className="section-kicker">Test coordination</span><h1>Manage driving tests</h1><p>Review requests and assign an active examiner and test time.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      <h2>Driving Tests</h2>
      <div className="table-scroll"><table>
        <thead>
          <tr>
            <th>Learner</th>
            <th>Examiner</th>
            <th>Date</th>
            <th>Status</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {drivingTests.map((test) => (
            <tr key={test._id}>
              <td>{test.Learner?.username}</td>
              <td>{test.examiner?.username || "Not Assigned"}</td>
              <td>{test.date ? new Date(test.date).toLocaleDateString() : "Not Scheduled"}</td>
              <td><span className={`status-chip status-${test.status}`}>{test.status}</span></td>
              <td>{test.result}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <h2>Schedule Driving Test</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="testId">Driving Test</label>
          <select id="testId" name="testId" value={formData.testId} onChange={handleChange} required>
            <option value="">Select Test</option>
            {drivingTests.filter((test) => test.status === "pending").map((test) => (
              <option key={test._id} value={test._id}>{test.Learner?.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="examiner">Examiner</label>
          <select id="examiner" name="examiner" value={formData.examiner} onChange={handleChange} required>
            <option value="">Select Examiner</option>
            {examiners.map((examiner) => (
              <option key={examiner._id} value={examiner._id}>{examiner.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Test Date</label>
          <input id="date" type="datetime-local" name="date" min={getDateTimeLocalMinimum()} value={formData.date} onChange={handleChange} required />
        </div>
        <button type="submit">Schedule Test</button>
      </form>
    </div>
  );
}

export default ManageDrivingTests;
