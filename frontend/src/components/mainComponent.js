import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Signup from "./signup/signupComponent";
import Confirmation from "./signup/confirmationComponent";
import Login from "./login/loginComponent";
import Home from "./home/homeComponent";
import Landing from "./home/landingComponent";
import Forgot from "./forgot/verifyComponent";
import Update from "./forgot/updateComponent";
import SignNav from "./navbar/signNav";
import Profile from "./profileComponent";
import LoginNav from "./navbar/loginNav";
import AdminLoginNav from "./navbar/adminNav";
import Alpha from "./insert/alphaComponent";
import Generate from "./generate/schemaComponent";
import Options from "./edit/optionComponent";
import Department from "./Admin/department";
import Subject from "./Admin/subject";
import AdminHome from "./Admin/adminHome";

import localStorage from "local-storage";

// 🔁 Unified PrivateRoute with role-based access
const PrivateRoute = ({ component: Component, adminOnly = false, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const token = localStorage.get("token");
      const user = localStorage.get("user");

      if (!token) {
        return <Redirect to="/home" />;
      }

      if (adminOnly && (!user || !user.admin)) {
        return <Redirect to="/home" />;
      }

      return <Component {...props} />;
    }}
  />
);

class Main extends Component {
  render() {
    const user = localStorage.get("user");
    const token = localStorage.get("token");

    // 🔁 Dynamic Nav based on auth role
    const nav = token ? (user?.admin ? <AdminLoginNav user={user} /> : <LoginNav user={user} />) : <SignNav />;

    return (
      <div>
        {nav}
        <Switch>
          {/* Public Routes */}
          <Route path="/home" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/user/:userId" render={({ match }) => <Confirmation {...match} />} />
          <Route path="/signin" render={({ match }) => <Login {...match} />} />
          <Route path="/forgot/:userId" render={({ match }) => <Update {...match} />} />
          <Route path="/forgot" component={Forgot} />

          {/* Admin Routes */}
          <PrivateRoute path="/department" component={Department} adminOnly />
          <PrivateRoute path="/subject" component={Subject} adminOnly />
          <PrivateRoute path="/profile" component={Profile} adminOnly />
          <PrivateRoute path="/home" component={AdminHome} adminOnly />

          {/* Authenticated Teacher Routes */}
          <PrivateRoute exact path="/insert" component={Alpha} />
          <PrivateRoute exact path="/generate" component={Generate} />
          <PrivateRoute exact path="/edit" component={Options} />
          <PrivateRoute exact path="/landing" component={Landing} />
          <PrivateRoute exact path="/profile" component={Profile} />

          {/* Default fallback */}
          <Redirect to={token ? "/landing" : "/home"} />
        </Switch>
      </div>
    );
  }
}

export default Main;
