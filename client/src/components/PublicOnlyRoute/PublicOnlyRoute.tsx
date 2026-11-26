import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import CurrentUserContext from '../../contexts/CurrentUserContext';
import AuthLoader from '../AuthLoader/AuthLoader';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  isCheckingAuth: boolean;
}

function PublicOnlyRoute({
  children,
  isCheckingAuth,
}: PublicOnlyRouteProps): React.JSX.Element {
  const currentUser = useContext(CurrentUserContext);

  if (isCheckingAuth) {
    return <AuthLoader />;
  }

  return currentUser ? <Navigate replace to="/" /> : <>{children}</>;
}

export default PublicOnlyRoute;
