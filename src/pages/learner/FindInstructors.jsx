import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getInstructors } from "../../services/userService";

function FindInstructors() {
  const [instructors, setInstructors] = useState([]);

  async function loadInstructors() {
    try {
      const response = await getInstructors();
      setInstructors(response);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  }

  useEffect(() => {
    loadInstructors();
  }, []);

  return (
    <div className="find-instructors-page">
      <h1>Find Instructors</h1>

      <div className="instructors-list">
        {instructors.map((instructor) => (
          <div key={instructor._id} className="instructor-card">
            <h3>{instructor.username}</h3>
            <p>Hourly Rate: ${instructor.hourlyRate} / hour</p>
            {instructor.availability && (
              <p>Available from: {new Date(instructor.availability).toLocaleDateString()}</p>
            )}
            <Link to={`/instructors/${instructor._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindInstructors;