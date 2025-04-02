import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotificationsPage from './pages/NotificationsPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<NotificationsPage />} />
            </Routes>
        </Router>
    );
};

export default App;