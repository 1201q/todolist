import React, { useEffect } from "react";
import AppRouter from "./Router";
import { useState } from "react";
import { authService } from "fbase";
import { Ring } from "@uiball/loaders";
import styles from "components/styles/LoadingStyle.css";

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
    <div className="mainContainer">
      {loading ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        <div className="loadingContainer">
          <Ring
            className="loading"
            size={50}
            lineWeight={8}
            speed={3}
            color="black"
          />
        </div>
      )}
    </div>
  );
}

export default App;
