import { useState, useEffect } from "react";
import { getDrivingTests, scheduleDrivingTest } from "../../services/drivingTestService";
import { getUsers } from "../../services/userService";

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
    } catch (err) {
      setError("Failed to load driving tests");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  function handleChange(event) {
    setFormData({...formData,[event.target.name]: event.target.value});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const response = await scheduleDrivingTest(formData.testId, formData.examiner, formData.date);
      setFormData({ testId: "", examiner: "", date: "" });
      getData();
    } catch (err) {
      setError("Failed to schedule driving test");
    }
  }

  return (
    <div>
      <h1>Manage Driving Tests</h1>
      <p>View driving tests and assign examiners.</p>
      {error && <p>{error}</p>}
      <h2>Driving Tests</h2>
      <table>
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
              <td>{test.status}</td>
              <td>{test.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
          <input id="date" type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <button type="submit">Schedule Test</button>
      </form>
    </div>
  );
}

export default ManageDrivingTests;