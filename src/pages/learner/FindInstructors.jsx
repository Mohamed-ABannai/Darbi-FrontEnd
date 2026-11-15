import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getInstructors } from "../../services/userService";

function FindInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const visibleInstructors = instructors.filter((instructor) =>
    (instructor.username || "").toLowerCase().includes(search.trim().toLowerCase())
  );

  useEffect(() => {
    let active = true;
    getInstructors().then((response) => {
      if (active) setInstructors(response);
    }).catch((error) => {
      console.error("Error fetching instructors:", error);
      if (active) setError("We couldn't load instructors right now. Please try again.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="find-instructors-page">
      <div className="page-heading"><span className="section-kicker">Find your fit</span><h1>Meet your instructor</h1><p>Explore instructors and choose someone to begin your training journey with.</p></div>

      <div className="directory-toolbar"><label className="sr-only" htmlFor="instructor-search">Search instructors</label><input id="instructor-search" type="search" placeholder="Search by instructor name" value={search} onChange={(event) => setSearch(event.target.value)} /></div>

      {error && <p className="error" role="alert">{error}</p>}
      {loading && <div className="empty-state"><span className="loading-mark"/><p>Finding instructors…</p></div>}

      {!loading && visibleInstructors.length === 0 && <div className="empty-state"><h2>{search ? "No instructors match that search" : "No instructors available yet"}</h2><p>{search ? "Try another name." : "Check back soon for instructor profiles."}</p></div>}
      {!loading && visibleInstructors.length > 0 && <div className="instructors-list">
        {visibleInstructors.map((instructor) => (
          <div key={instructor._id} className="instructor-card">
            <span className="profile-initial" aria-hidden="true">{(instructor.username || "I").charAt(0).toUpperCase()}</span>
            <div className="instructor-card-copy"><span className="section-kicker">Driving instructor</span><h3>{instructor.username}</h3></div>
            <p><b>{instructor.hourlyRate ? `${Number(instructor.hourlyRate).toFixed(3)} BHD` : "Rate not provided"}</b> {instructor.hourlyRate && <span>/ hour</span>}</p>
            {instructor.availability && (
              <p>Available from: {new Date(instructor.availability).toLocaleDateString()}</p>
            )}
            <Link to={`/instructors/${instructor._id}`}>View profile <span aria-hidden="true">→</span></Link>
          </div>
        ))}
      </div>}
    </div>
  );
}

export default FindInstructors;
