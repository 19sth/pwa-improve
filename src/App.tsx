import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/main';
import MuLayout from './components/mulayout';
import MuImportExport from './components/muimportexport';
import Add from './pages/add';
import { ROUTE_PREFIX } from './utils/constants';
import Detail from './pages/detail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`${ROUTE_PREFIX}/`} element={<MuLayout />}>
          <Route index element={<Main />} />
          <Route path="importexport" element={<MuImportExport />} />
          <Route path="add" element={<Add />} />
          <Route path="detail/:id" element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
