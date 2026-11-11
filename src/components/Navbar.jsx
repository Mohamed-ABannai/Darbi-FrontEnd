import { Link, useLocation } from 'react-router'
import * as Mantine from '../../node_modules/@mantine/core/cjs/index.cjs'

const { Avatar, Button, Group, Menu, Text } = Mantine

function Navbar({ user, handleLogout }) {
  const location = useLocation()
  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin'
  return (
    <nav className="top-nav">
      <Link className="brand" to="/"><span className="brand-mark">D</span><span><Text fw={800} size="lg">DARBI</Text><Text className="brand-subtitle">DRIVING SMARTER</Text></span></Link>
      <Group gap="xs" className="nav-links">
        <Link className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} to="/">Home</Link>
        {user && <Link className={location.pathname.includes('dashboard') ? 'nav-link active' : 'nav-link'} to={isAdmin ? '/admin-dashboard' : '/dashboard'}>{isAdmin ? 'Admin portal' : 'Dashboard'}</Link>}
        {!user && <><Link className="nav-link" to="/sign-up">Sign up</Link><Link className="nav-link" to="/sign-in">Sign in</Link></>}
      </Group>
      {user && <Menu shadow="md" width={190} position="bottom-end"><Menu.Target><Button variant="subtle" className="profile-trigger" leftSection={<Avatar size={30} color="red">{user.username?.[0]?.toUpperCase() || 'A'}</Avatar>} rightSection="⌄">{user.username || 'Admin'}</Button></Menu.Target><Menu.Dropdown><Menu.Label>Signed in as {isAdmin ? 'Administrator' : 'User'}</Menu.Label><Menu.Item onClick={handleLogout} color="red">Sign out</Menu.Item></Menu.Dropdown></Menu>}
    </nav>
  )
}

export default Navbar
