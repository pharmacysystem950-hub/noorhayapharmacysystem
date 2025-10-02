import React, { useState, useEffect } from "react";
import "../styles/RotateWarning.css";

const RotateWrapper = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  if (isPortrait) {
    return (
      <div className="rotate-warning">
        <h2>📱 Please rotate your phone</h2>
        <p>This app works best in landscape mode.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RotateWrapper;
