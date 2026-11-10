import { useEffect, useState } from "react";
import { getLessons } from "../../services/trainingPlanService"; 

function InstructorLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLessons() {
      try {
        setLoading(true);
        const data = await getLessons();
        setLessons(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  if (loading) return <div>Loading instructor lessons...</div>;

  return (
    <div>
      <h1>My Lessons</h1>

      {error && <div>{error}</div>}

      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <div>
          {lessons.map((lesson) => (
            <div key={lesson._id}>
              <div>
                <p><strong>Title:</strong> {lesson.title || "Lesson"}</p>
                <p><strong>Description:</strong> {lesson.description || "N/A"}</p>
                <p><strong>Date & Time:</strong> {lesson.date ? new Date(lesson.date).toLocaleString() : "TBD"}</p>
                <p><strong>Status:</strong> {lesson.status || "Scheduled"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InstructorLessons;