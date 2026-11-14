
import { useEffect, useState } from "react";
import { getUserById, updateProfile } from "../../services/userService";

function Profile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    hourlyRate: "",
    availability: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getUserById(user._id);
        setProfileData(data);
        setFormData({
          phone: data.phone || "",
          email: data.email || "",
          hourlyRate: data.hourlyRate || "",
          availability: data.availability ? data.availability.slice(0, 10) : "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile information.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user._id]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      setActionMessage("");

      const body = { phone: formData.phone, email: formData.email };

      if (user.role === "instructor") {
        if (formData.hourlyRate) body.hourlyRate = formData.hourlyRate;
        if (formData.availability) body.availability = formData.availability;
      }

      await updateProfile(user._id, body);
      setActionMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  }

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>User Profile</h1>

      {error && <div className="error">{error}</div>}
      {actionMessage && <div>{actionMessage}</div>}

      <div>
        <p><strong>Name:</strong> {profileData?.username || user?.username}</p>
        <p><strong>Role:</strong> {profileData?.role || user?.role}</p>
        {user.role === "instructor" && (
          <p><strong>Approved:</strong> {profileData?.isApproved ? "Yes" : "Waiting for admin approval"}</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {user.role === "instructor" && (
          <>
            <div>
              <label htmlFor="hourlyRate">Hourly Rate (BHD, min 22):</label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                min="22"
                value={formData.hourlyRate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="availability">Available From:</label>
              <input
                type="date"
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button>Save</button>
      </form>
    </div>
  );
}

export default Profile;

