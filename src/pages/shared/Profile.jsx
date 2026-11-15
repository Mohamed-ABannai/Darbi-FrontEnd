import { useState, useEffect } from "react";
import { getUserById, updateProfile, getProfileImage } from "../../services/userService";

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
  const [photoPreview, setPhotoPreview] = useState("");
  const [saving, setSaving] = useState(false);

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
      try {
        const image = await getProfileImage(user._id);
        setPhotoPreview(URL.createObjectURL(image));
      } catch {
        // A profile image is optional; keep the initials avatar when none is stored.
      }
    } catch {
      setError("Failed to load profile");
    }
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    getUserById(user._id).then(async (response) => {
      if (!active) return;
      setFormData({
        phone: response.phone || "",
        email: response.email || "",
        dateOfBirth: response.dateOfBirth ? response.dateOfBirth.slice(0, 10) : "",
        hourlyRate: response.hourlyRate || "",
        availability: response.availability ? response.availability.slice(0, 10) : ""
      });
      try {
        const image = await getProfileImage(user._id);
        if (active) setPhotoPreview(URL.createObjectURL(image));
      } catch {
        if (active) setPhotoPreview("");
      }
    }).catch(() => {
      if (active) setError("Failed to load profile");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [user._id]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError(file.size > 5 * 1024 * 1024 ? "The profile photo must be 5 MB or smaller." : "Choose an image file to use as your profile photo.");
      event.target.value = "";
      return;
    }
    setError("");
    setProfileImage(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
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
      if (profileImage) window.dispatchEvent(new Event("darbi:profile-image-updated"));
      getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <div className="page-heading"><span className="section-kicker">Your account</span><h1>Profile & settings</h1><p>Keep your contact details up to date.</p></div>
      <section className="profile-overview"><div className="profile-avatar-wrap">{photoPreview ? <img className="profile-photo" src={photoPreview} alt={`${user.username} profile`} /> : <span className="profile-initial profile-initial-large">{(user.username || "D").charAt(0).toUpperCase()}</span>}</div><div><h2>{user.username}</h2><span className="role-pill">{user.role}</span></div></section>
      <section className="profile-edit"><h2>Personal details</h2>
      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}

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
          <input id="profileImage" type="file" name="profileImage" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} />
          <small className="field-hint">JPG, PNG, or WebP. Your new photo previews here before saving.</small>
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

        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </form></section>
    </div>
  );
}

export default Profile;
