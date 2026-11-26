import { createContext } from 'react';

import type { CurrentUser } from '../interfaces';

const CurrentUserContext = createContext<CurrentUser | null>(null);

export default CurrentUserContext;
