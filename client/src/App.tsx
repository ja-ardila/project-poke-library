import { Route, Routes } from 'react-router-dom';

import About from './components/About/About';
import AppLayout from './components/AppLayout/AppLayout';
import HomePage from './components/HomePage/HomePage';
import NotFound from './components/NotFound/NotFound';

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

