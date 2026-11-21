import { Outlet } from 'react-router-dom';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';

function AppLayout(): React.JSX.Element {
  return (
    <div className="page">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;

