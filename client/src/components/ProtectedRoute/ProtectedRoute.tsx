import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

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

  if (isCheckingAuth) {
    return <AuthLoader />;
  }

  if (!currentUser) {
    return <Navigate replace to="/signin" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
