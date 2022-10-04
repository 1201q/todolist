import React, { useEffect } from "react";
import AppRouter from "./Router";
import { useState } from "react";
import { authService } from "fbase";

function App() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
        });
      } else {
        setIsLoggedIn(false);
      }
      setLoading(true);
    });
  }, []);
  return (
    <div className="maincontainer">
      {loading ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default App;
