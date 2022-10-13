import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      <Switch>
        {isLoggedIn ? (
          <Route path="/">
            <Header userObj={userObj} />
            <Sidebar userObj={userObj} />
          </Route>
        ) : (
          <Route path="/">
            <Auth userObj={userObj} />
          </Route>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
