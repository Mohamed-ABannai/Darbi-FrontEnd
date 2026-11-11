import { Link } from 'react-router'

function Navbar({ user, handleLogout }) {
  return (
    <nav>
      <Link to='/'>Homepage</Link>
      {user ? (
        <>
          <Link to='/dashboard'>Dashboard</Link>
          <Link to='/profile'>Profile</Link>
          {user.role === 'instructor' && (
            <>
              <Link to='/instructor/training-requests'>Training Requests</Link>
              <Link to='/instructor/my-learners'>My Learners</Link>
              <Link to='/instructor/lessons'>Lessons</Link>
              <Link to='/instructor/payments'>Payments</Link>
            </>
          )}

          {user.role === 'examiner' && (
            <>
              <Link to='/examiner/dashboard'>Examiner Dashboard</Link>
              <Link to='/examiner/assigned-tests'>Assigned Tests</Link>
            </>
          )}

          <button onClick={handleLogout}>Sign Out</button>
        </>
      ) : (
        <>
          <Link to='/sign-up'>Sign Up</Link>
          <Link to='/sign-in'>Sign In</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar