import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/main';
import MuLayout from './components/mulayout';
import MuImportExport from './components/muimportexport';
import Add from './pages/add';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pwa-improve/" element={<MuLayout />}>
          <Route index element={<Main />} />
          <Route path="importexport" element={<MuImportExport />} />
          <Route path="add" element={<Add />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
