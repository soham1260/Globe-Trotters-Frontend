import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const storedToken = localStorage.getItem("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    } else if (storedToken) {
      navigate("/");
    } else {
      navigate("/login");
    }
  });

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;
