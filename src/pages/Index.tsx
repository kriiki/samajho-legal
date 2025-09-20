import { useState } from 'react';
import { Auth } from './Auth';
import { Dashboard } from './Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleAuthSuccess = (data: any) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return <Dashboard userData={userData} onLogout={handleLogout} />;
};

export default Index;
