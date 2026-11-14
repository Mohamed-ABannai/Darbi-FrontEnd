import LearnerDashboard from "./learner/LearnerDashboard";


function Dashboard({ user }) {
  if (user.role === "learner") {
    return <LearnerDashboard user={user} />;
  }

  return (
    <div>
      <h1>Welcome {user.username}</h1>
    </div>
  );
}

export default Dashboard