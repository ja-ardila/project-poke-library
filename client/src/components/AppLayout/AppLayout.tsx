import { Outlet } from 'react-router-dom';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';

interface AppLayoutProps {
  isCheckingAuth: boolean;
  onLogout: () => void;
}

function AppLayout({
  isCheckingAuth,
  onLogout,
}: AppLayoutProps): React.JSX.Element {
  return (
    <div className="page">
      <Header isCheckingAuth={isCheckingAuth} onLogout={onLogout} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;

