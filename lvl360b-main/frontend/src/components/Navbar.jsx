import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Link, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AxiosInstance from './AxiosInstance';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import { FaUserCircle } from 'react-icons/fa'; // Import FaUserCircle icon

const drawerWidth = 240;

export default function Navbar(props) {
  const { content } = props;
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const logoutUser = () => {
    AxiosInstance.post(`logoutall/`, {})
      .then(() => {
        localStorage.removeItem("Token");
        navigate('/');
      })
      .catch(error => {
        console.error("Logout error:", error);
      });
  };

  const handleProfileNavigation = () => {
    // Implement your logic to navigate to the user profile page
    navigate('/profile');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}>
        <Toolbar>
          {/* Replace Typography with an image */}
          <img src="./src/assets/lvl360b1a.png" alt="Logo" style={{ height: 40 }} />
          {/* User Profile Button */}
          <IconButton
            className="profileButton"
            onClick={handleProfileNavigation}
            color="primary"
            sx={{
              color: '#3f51b5', // Dark blue color
              marginLeft: 'auto', // Push button to the right
              fontSize: '2em', // Increase icon size
            }}
          >
            <FaUserCircle size="2em" />          
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Replace Drawer with a div) */}
      <div className="sidebar">
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem key={1} disablePadding>
              <ListItemButton component={Link} to="/home" selected={"/home" === path}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItemButton>
            </ListItem>

            <ListItem key={2} disablePadding>
              <ListItemButton component={Link} to="/about" selected={"/about" === path}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary={"Users"} />
              </ListItemButton>
            </ListItem>

            <ListItem key={3} disablePadding>
              <ListItemButton component={Link} to="/Questions" selected={"/Questions" === path}>
                <ListItemIcon>
                  <QuestionMarkIcon />
                </ListItemIcon>
                <ListItemText primary={"Communication"} />
              </ListItemButton>
            </ListItem>

            <ListItem key={4} disablePadding>
              <ListItemButton onClick={logoutUser}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        {/* Banner below the Logout button */}
        <Box sx={{ position: 'absolute', bottom: 50, left: 10, right: 10, textAlign: 'center', zIndex: 999 }}>
          <Typography variant="body1" sx={{ backgroundColor: '#1976d2', color: '#fff', padding: '10px 20px', borderRadius: '10px' }}>
          An intelligent procurement platform specifically designed by REFM professionals for REFM services

          </Typography>
        </Box>
      </div>

      <Box component="main" sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}