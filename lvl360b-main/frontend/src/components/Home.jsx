import AxiosInstance from './AxiosInstance';
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import Home.css for styling
import { FaPlus, FaPlayCircle, FaCheckCircle } from 'react-icons/fa'; // Import icons from react-icons/fa

const Home = () => {
  const [myData, setMyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectsInProgress, setProjectsInProgress] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [projectStatus, setProjectStatus] = useState({ red: 0, amber: 0, green: 0 });
  const navigate = useNavigate();

  // Function to fetch data from AxiosInstance
  const fetchData = async () => {
    try {
      const [userDataResponse, projectsResponse] = await Promise.all([
        AxiosInstance.get('users/'),
        AxiosInstance.get('projects/')
      ]);
      setMyData(userDataResponse.data);
      const inProgress = projectsResponse.data.filter(project => project.status === 'in_progress');
      const completed = projectsResponse.data.filter(project => project.status === 'completed');
      const red = inProgress.filter(project => project.status === 'red').length;
      const amber = inProgress.filter(project => project.status === 'amber').length;
      const green = inProgress.filter(project => project.status === 'green').length;
      setProjectsInProgress(inProgress);
      setCompletedProjects(completed);
      setProjectStatus({ red, amber, green });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle navigation to projects page with filter
  const handleViewProjects = (filter) => {
    navigate(`/projects?status=${filter}`);
  };

  // Function to handle navigation to profile page
  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  return (
    <div className="homeContainer">
      <div className="headerContainer">
        {/* Welcome message positioned at the top left corner */}
        <Typography variant="h6" className="welcomeMessage">Welcome {myData?.first_name}!</Typography>
      </div>

      {/* White box container for project details */}
      <Box className="whiteBox">
        {loading ? <p>Loading data...</p> :
          <div className="dashboard">
            {/* Top section with In Progress Projects button and Heatmap */}
            <Box className="topSection">
              <Box className="projectBoxContainer">
                <Typography variant="h6" className="sectionTitle">Projects In Progress</Typography>
                <Button
                  className="projectBox"
                  onClick={() => handleViewProjects('in_progress')}
                  variant="contained"
                  color="primary"
                  startIcon={<FaPlayCircle />}
                  sx={{
                    borderRadius: '50%', // Make it circular
                    width: '80px', // Adjust size as needed
                    height: '80px', // Adjust size as needed
                    backgroundColor: '#3f51b5', // Dark blue background color
                    color: 'white', // White text color
                    fontSize: '1.5rem', // Adjust font size
                    margin: '0 10px', // Adjust margin between buttons
                  }}
                >
                  {projectsInProgress.length}
                </Button>
              </Box>
              <Box className="heatmapContainer">
                <Typography variant="h6" className="sectionTitle">Project Status</Typography>
                <Grid container spacing={2} className="statusHeatmap">
                  <Grid item xs={4}>
                    <Box className="heatmapCard red">
                      <Typography className="heatmapCardTitle"></Typography>
                      <Typography className="heatmapCardCount">{projectStatus.red}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box className="heatmapCard amber">
                      <Typography className="heatmapCardTitle"></Typography>
                      <Typography className="heatmapCardCount">{projectStatus.amber}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box className="heatmapCard green">
                      <Typography className="heatmapCardTitle"></Typography>
                      <Typography className="heatmapCardCount">{projectStatus.green}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Horizontal line to separate sections */}
            <hr className="sectionDivider" />

            {/* Bottom section with Completed Projects button and Key Metrics */}
            <Box className="bottomSection">
              <Box className="projectBoxContainer">
                <Typography variant="h6" className="sectionTitle">Completed Projects</Typography>
                <Button
                  className="projectBox"
                  onClick={() => handleViewProjects('completed')}
                  variant="contained"
                  color="primary"
                  startIcon={<FaCheckCircle />}
                  sx={{
                    borderRadius: '50%', // Make it circular
                    width: '80px', // Adjust size as needed
                    height: '80px', // Adjust size as needed
                    backgroundColor: '#3f51b5', // Dark blue background color
                    color: 'white', // White text color
                    fontSize: '1.5rem', // Adjust font size
                    margin: '0 10px', // Adjust margin between buttons
                  }}
                >
                  {completedProjects.length}
                </Button>
              </Box>
              <Box className="metricsContainer">
                <Typography variant="h6" className="sectionTitle">Key Metrics</Typography>
                <Typography variant="body1">Total Contract Value: $XYZ</Typography>
                <Typography variant="body1">Estimated Savings: X%</Typography>
              </Box>
            </Box>
          </div>
        }
      </Box>

      {/* Space between white box and button */}
      <Box mt={2}></Box>

      {/* Separate button outside the white box */}
      <Button
        className="addProjectButton"
        variant="contained"
        color="primary"
        startIcon={<FaPlus />}
        onClick={() => navigate('/add-project')}
      >
        Add New Project
      </Button>
    </div>
  );
};

export default Home;


















