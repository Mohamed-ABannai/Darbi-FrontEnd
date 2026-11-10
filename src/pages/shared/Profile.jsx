import { useEffect, useState } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService"; 

function Profile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getTrainingPlans();
        setProfileData(data);
      } catch (err) {
        setError("Failed to load profile information.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>User Profile</h1>

      {error && <div>{error}</div>}

      <div>
        <p><strong>Name:</strong> {user?.username || user?.name || "User"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
        <p><strong>Role:</strong> {user?.role || "Member"}</p>
      </div>
    </div>
  );
}

export default Profile;