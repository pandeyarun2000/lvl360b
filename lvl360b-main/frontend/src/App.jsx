import { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import About from './components/About';
import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordReset from './components/PasswordReset';
import AddProject from './components/AddProject';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import EditProject from './components/EditProject';
import UserProfile from './components/UserProfile'; 

function App() {
  const location = useLocation();
  const noNavbar = location.pathname === "/register" || location.pathname === "/" || location.pathname.includes("password");

  return (
    <div className="appContainer"> 
      {/* Conditionally render video background for login and register pages */}
      {noNavbar ?
        <div className="videoBackgroundContainer">
          <video autoPlay loop muted className="videoBackground">
            <source src="./src/assets/backgroundlvl360.jpg" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <img src="./src/assets/lvl360b1a.png" alt="Logo" className="logo" />
        </div>
        : null
      }

      { /* Render different content based on the current route */ }
      {noNavbar ?
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/request/password_reset" element={<PasswordResetRequest />} />
          <Route path="/password-reset/:token" element={<PasswordReset />} />
        </Routes>
        :
        <div className="appBackground">
          <Navbar /> {/* Navbar outside the content wrapper */}
          <div className="main-content"> {/* Wrap the routes in main-content */}
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/add-project" element={<AddProject />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/projects/:projectId/edit" element={<EditProject />} />
                <Route path="/profile" element={<UserProfile />} /> 
              </Route>
            </Routes>
          </div> 
        </div>
      }
    </div>
  );
}

export default App;