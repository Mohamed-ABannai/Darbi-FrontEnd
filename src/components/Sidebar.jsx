import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router";
import logo from "../assets/Darbi.png";
import { getProfileImage } from "../services/userService";

const navigation = {
  learner: [
    { label: "Dashboard", path: "/dashboard", icon: "grid" },
    { label: "Find Instructors", path: "/find-instructors", icon: "search" },
    { label: "My Training Plans", path: "/my-plans", icon: "book" },
    { label: "My Lessons", path: "/lessons", icon: "calendar" },
    { label: "Driving Tests", path: "/driving-tests", icon: "car" },
    { label: "Payments", path: "/payments", icon: "card" },
    { label: "Reviews", path: "/reviews", icon: "star" },
  ],
  instructor: [
    { label: "Dashboard", path: "/dashboard", icon: "grid" },
    { label: "Training Requests", path: "/instructor/requests", icon: "inbox" },
    { label: "My Learners", path: "/instructor/learners", icon: "users" },
    { label: "Manage Lessons", path: "/instructor/lessons", icon: "calendar" },
    { label: "Payments", path: "/instructor/payments", icon: "card" },
  ],
  examiner: [
    { label: "Dashboard", path: "/dashboard", icon: "grid" },
    { label: "Assigned Tests", path: "/examiner/assigned-tests", icon: "car" },
  ],
  admin: [
    { label: "Dashboard", path: "/dashboard", icon: "grid" },
    { label: "Manage Users", path: "/admin/users", icon: "users" },
    { label: "Manage Examiners", path: "/admin/examiners", icon: "check" },
    { label: "Instructor Approvals", path: "/admin/instructor-approvals", icon: "check" },
    { label: "Manage Training", path: "/admin/training", icon: "book" },
    { label: "Manage Reviews", path: "/admin/reviews", icon: "star" },
    { label: "Driving Tests", path: "/admin/driving-tests", icon: "car" },
  ],
};

const iconPaths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 5 5" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  car: <><path d="m5 11 1.5-5h11L19 11M3 11h18l-1 8H4z" /><path d="M6 15h.01M18 15h.01M7 19v2m10-2v2" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18m-14 5h4" /></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" />,
  inbox: <><path d="M4 4h16l2 12v4H2v-4z" /><path d="M2 15h6l2 3h4l2-3h6" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  check: <><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  exit: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
};

function Icon({ name }) {
  return <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
}

function Sidebar({ user, handleLogout, isOpen, onClose }) {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const role = user.role === "superAdmin" ? "admin" : user.role;
  const links = [...(navigation[role] || [])];
  const roleLabel = user.role === "superAdmin" ? "Super Admin" : user.role;

  if (user.role === "superAdmin") {
    links.push({ label: "Manage Admins", path: "/admin/manage-admins", icon: "users" });
  }

  useEffect(() => {
    let active = true;
    let imageUrl = "";
    async function loadProfileImage() {
      try {
        const image = await getProfileImage(user._id);
        const nextUrl = URL.createObjectURL(image);
        if (!active) {
          URL.revokeObjectURL(nextUrl);
          return;
        }
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        imageUrl = nextUrl;
        setProfileImageUrl(nextUrl);
      } catch {
        if (active) setProfileImageUrl("");
      }
    }

    const timer = window.setTimeout(loadProfileImage, 0);
    window.addEventListener("darbi:profile-image-updated", loadProfileImage);
    return () => {
      active = false;
      window.clearTimeout(timer);
      window.removeEventListener("darbi:profile-image-updated", loadProfileImage);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [user._id]);

  return (
    <>
      <button className={`sidebar-overlay${isOpen ? " is-visible" : ""}`} type="button" aria-label="Close navigation" onClick={onClose} tabIndex={isOpen ? 0 : -1} />
      <aside className={`app-sidebar${isOpen ? " is-open" : ""}`} aria-label={`${roleLabel} navigation`}>
        <div className="sidebar-topline">
          <Link className="sidebar-brand" to="/dashboard" onClick={onClose} aria-label="DARBI dashboard">
            <img src={logo} alt="DARBI" />
            <span aria-hidden="true">DARBI</span>
          </Link>
          <button className="sidebar-close" type="button" onClick={onClose} aria-label="Close menu">×</button>
        </div>
        <div className="sidebar-role">{roleLabel} portal</div>
        <nav className="sidebar-nav" aria-label="Portal pages">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === "/dashboard"} onClick={onClose} className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}>
              <Icon name={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-account">
            <span className="account-avatar" aria-hidden="true">{profileImageUrl ? <img src={profileImageUrl} alt="" /> : (user.username || user.name || user.email || "D").charAt(0).toUpperCase()}</span>
            <span className="account-details"><strong>{user.username || user.name || user.email || "My account"}</strong><span>{roleLabel}</span></span>
          </div>
          <Link className="sidebar-link" to="/profile" onClick={onClose}><Icon name="user" /><span>Profile</span></Link>
          <button className="sidebar-link sidebar-signout" type="button" onClick={handleLogout}><Icon name="exit" /><span>Sign Out</span></button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
