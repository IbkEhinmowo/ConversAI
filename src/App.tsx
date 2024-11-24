import LandingPage from './Home/Landing'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContextInput from './Chat/context';

import Chat from './Home/Chat'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
