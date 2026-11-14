import { useState, useEffect } from "react";
import { getUserById, updateProfile } from "../../services/userService";

function Profile({ user }) {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    dateOfBirth: "",
    hourlyRate: "",
    availability: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function getData() {
    try {
      const response = await getUserById(user._id);
      setFormData({
        phone: response.phone || "",
        email: response.email || "",
        dateOfBirth: response.dateOfBirth ? response.dateOfBirth.slice(0, 10) : "",
        hourlyRate: response.hourlyRate || "",
        availability: response.availability ? response.availability.slice(0, 10) : ""
      });
    } catch (err) {
      setError("Failed to load profile");
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, [user._id]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = new FormData();
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      if (formData.dateOfBirth) {
        data.append("dateOfBirth", formData.dateOfBirth);
      }
      if (user.role === "instructor") {
        if (formData.hourlyRate) {
          data.append("hourlyRate", formData.hourlyRate);
        }
        if (formData.availability) {
          data.append("availability", formData.availability);
        }
      }
      if (profileImage) {
        data.append("profileImage", profileImage);
      }
      const response = await updateProfile(user._id, data);
      setMessage(response.message || "Profile updated successfully");
      getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  }

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>My Profile</h1>
      <p>View and update your DARBI profile.</p>
      <h2>Account Information</h2>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>

      <h2>Edit Profile</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="profileImage">Profile Image</label>
          <input id="profileImage" type="file" name="profileImage" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => setProfileImage(event.target.files[0])} />
        </div>

        {user.role === "instructor" && (
          <div>
            <h2>Instructor Information</h2>
            <div>
              <label htmlFor="hourlyRate">Hourly Rate (BHD)</label>
              <input id="hourlyRate" type="number" name="hourlyRate" min="22" value={formData.hourlyRate} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="availability">Availability Date</label>
              <input id="availability" type="date" name="availability" value={formData.availability} onChange={handleChange} />
            </div>
            <p>Your verification document was submitted during registration.</p>
          </div>
        )}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Profile;