import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AssetsPage from './pages/emissions/AssetsPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AssetsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
