/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginPage from 'containers/LoginPage';
import DashboardIIoT from 'containers/DashboardIioT/';
import DevicePage from 'containers/DevicePage/';
import EventPage from 'containers/EventPage';
import TagPage from 'containers/TagPage';
import UrlPage from 'containers/UrlPage';
import AlertPage from 'containers/AlertPage';
import PersonnelPage from 'containers/PersonnelPage';
import NotFoundPage from 'containers/NotFoundPage/';

import AdminCPPage from 'containers/AdminSubMenuPage/AdminCPPage/';
import AdminUserPage from 'containers/AdminSubMenuPage/UserPage/';
import AdminRolePage from 'containers/AdminSubMenuPage/RolePage/';
import AdminFunctionPage from 'containers/AdminSubMenuPage/FunctionPage/';
import AdminGrpPage from 'containers/AdminSubMenuPage/AdminGrpPage/';
// import AdminExpenseGrpPage from 'containers/AdminSubMenuPage/ExpenseGrpPage/';
// import AdminSystemPage from 'containers/AdminSubMenuPage/SystemPage';
// import BindingPage from 'containers/Binding';
// import ActivePage from 'containers/Active';
// import RoboticPage from 'containers/RoboticPage';

import styled from 'styled-components';

import Header from '../Main/index';

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  background-color: '#ffffff';
  color: '#ffffff';
`;

export default function App() {
  return (
    <AppWrapper>
      {window.location.pathname === '/' ? (
        <Switch>
          <Route path="/" exact component={LoginPage} />
        </Switch>
      ) : (
        <Header>
          <Switch>
            <Route path="/dashboard" component={DashboardIIoT} />
            <Route path="/device" component={DevicePage} location={location} />
            <Route path="/event" component={EventPage} location={location} />
            <Route path="/tag" component={TagPage} location={location} />
            <Route path="/urlLink" component={UrlPage} location={location} />
            <Route path="/alert" component={AlertPage} location={location} />
            <Route path="/personnel" component={PersonnelPage} location={location} />

            <Route path="/admin/users" component={AdminUserPage} />
            <Route path="/admin/roles" component={AdminRolePage} />
            <Route path="/admin/functions" component={AdminFunctionPage} />
            <Route path="/admin/grps" component={AdminGrpPage} />
            <Route path="/admin/cps" component={AdminCPPage} />

            <Route path="" component={NotFoundPage} />

            {/* <Route path="/demo" component={DemoPage} location={location} /> */}
            {/* <Route path="/admin/prop" component={AdminSystemPage} /> */}
            {/* <Route path="/admin/egrp" component={AdminExpenseGrpPage} /> */}
            {/* <Route path="/bind" component={BindingPage} location={location} /> */}
            {/* <Route path="/activate" component={ActivePage} location={location} /> */}
            {/* <Route path="/robotic" component={RoboticPage} location={location} /> */}
            {/* <Route path="/alarm" component={AlarmPage} location={location} /> */}
          </Switch>
        </Header>
      )}
    </AppWrapper>
  );
}
