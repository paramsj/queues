import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 64px' }}>
        <Outlet />
      </main>
    </div>
  );
}
