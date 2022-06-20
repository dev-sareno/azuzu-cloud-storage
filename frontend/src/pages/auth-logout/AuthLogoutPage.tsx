import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AuthLogoutPage = () => {
  const navigate = useNavigate();
  const {refresh} = useAuth();

  useEffect(() => {
    localStorage.clear();
    refresh()
    navigate('/login');
  }, [navigate, refresh]);

  return (
    <div>Logging out...</div>
  )
};

export default AuthLogoutPage;