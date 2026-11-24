import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import CurrentUserContext from '../../contexts/CurrentUserContext';
import AuthLoader from '../AuthLoader/AuthLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isCheckingAuth: boolean;
}

function ProtectedRoute({
  children,
  isCheckingAuth,
}: ProtectedRouteProps): React.JSX.Element {
  const currentUser = useContext(CurrentUserContext);
  const location = useLocation();

  if (isCheckingAuth) {
    return <AuthLoader />;
  }

  if (!currentUser) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/signin"
      />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
