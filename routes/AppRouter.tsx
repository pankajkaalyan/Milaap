import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import CustomerDashboard from '../pages/customer/Dashboard';
import AdminUsers from '../pages/admin/Users';
import NotFound from '../pages/NotFound';
import { useAuthContext } from '../hooks/useAuthContext';
import { UserRole, AdminRole } from '../types';
import Profile from '../pages/customer/Profile';
import Matches from '../pages/customer/Matches';
import Favourites from '../pages/customer/Favourites';
import Visitors from '../pages/customer/Visitors';
import Messages from '../pages/customer/Messages';
import ViewProfile from '../pages/customer/ViewProfile';
import KundliMatch from '../pages/customer/KundliMatch';
import Verification from '../pages/customer/Verification';
import SuccessStories from '../pages/SuccessStories';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Search from '../pages/Search';
import Settings from '../pages/customer/Settings';
import Membership from '../pages/Membership';
import Changelog from '../pages/Changelog';
import Interests from '../pages/customer/Interests';
import MutualMatches from '../pages/customer/MutualMatches';

// Admin Imports
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import VerificationRequests from '../pages/admin/VerificationRequests';
import Reports from '../pages/admin/Reports';
import AdminStorySubmissions from '../pages/admin/StorySubmissions';
import VerificationLogs from '../pages/admin/VerificationLogs';
import AccessControl from '../pages/admin/AccessControl';
import Communication from '../pages/admin/Communication';
import Reporting from '../pages/admin/Reporting';
import SuccessStoryDetail from '../pages/SuccessStoryDetail';

interface PrivateRouteProps {
  children: React.ReactElement;
  roles: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  let { user } = useAuthContext();
  if(!user) { 
    user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  }
  // console.log('PrivateRoute - user:', user);
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

interface SuperAdminRouteProps {
  children: React.ReactElement;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user } = useAuthContext();
  if (!user || user.role !== UserRole.ADMIN || user.adminRole !== AdminRole.SUPER_ADMIN) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};


const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="success-stories" element={<SuccessStories />} />
          <Route path="success-stories/:storyId" element={<SuccessStoryDetail />} />
          <Route path="changelog" element={<Changelog />} />
          
          {/* Customer Routes */}
          <Route 
            path="dashboard" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <CustomerDashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="matches" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Matches />
              </PrivateRoute>
            } 
          />
           <Route 
            path="search" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Search />
              </PrivateRoute>
            } 
          />
          <Route 
            path="mutual-matches" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <MutualMatches />
              </PrivateRoute>
            } 
          />
          <Route 
            path="favourites" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Favourites />
              </PrivateRoute>
            } 
          />
           <Route 
            path="visitors" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Visitors />
              </PrivateRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="profile/:userId" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <ViewProfile />
              </PrivateRoute>
            } 
          />
           <Route 
            path="kundli-match/:userId" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <KundliMatch />
              </PrivateRoute>
            } 
          />
           <Route 
            path="messages" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Messages />
              </PrivateRoute>
            } 
          />
          <Route 
            path="messages/:userId" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Messages />
              </PrivateRoute>
            } 
          />
          <Route 
            path="verification" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Verification />
              </PrivateRoute>
            } 
          />
           <Route 
            path="settings" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Settings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="membership" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Membership />
              </PrivateRoute>
            } 
          />
          <Route 
            path="interests" 
            element={
              <PrivateRoute roles={[UserRole.CUSTOMER, UserRole.ROLE_USER]}>
                <Interests />
              </PrivateRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="admin" 
            element={
              <PrivateRoute roles={[UserRole.ADMIN]}>
                <AdminLayout />
              </PrivateRoute>
            } 
          >
            {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
            {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
            <Route path="user-management" element={<AdminUsers />} />
            <Route path="verification-requests" element={<VerificationRequests />} />
            <Route path="verification-logs" element={<VerificationLogs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="story-submissions" element={<AdminStorySubmissions />} />
             <Route 
              path="communication" 
              element={
                <SuperAdminRoute>
                  <Communication />
                </SuperAdminRoute>
              } 
            />
            <Route 
              path="access-control" 
              element={
                <SuperAdminRoute>
                  <AccessControl />
                </SuperAdminRoute>
              } 
            />
            <Route 
              path="reporting" 
              element={
                <SuperAdminRoute>
                  <Reporting />
                </SuperAdminRoute>
              } 
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;