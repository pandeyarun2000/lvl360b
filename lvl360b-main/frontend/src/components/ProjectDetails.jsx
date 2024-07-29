import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from './AxiosInstance';
import {
  Box, Typography, Button, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './ProjectDetails.css'; // Import the custom CSS
import dayjs from 'dayjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [openRequirements, setOpenRequirements] = useState(false);
  const [openServiceScope, setOpenServiceScope] = useState(false);
  const [openGeographies, setOpenGeographies] = useState(false);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await AxiosInstance.get(`/projects/${id}/`);
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLogs = async () => {
      try {
        const response = await AxiosInstance.get(`/projects/${id}/logs/`);
        setLogs(response.data);
        console.log("Fetched logs:", response.data);
      } catch (error) {
        console.error("Error fetching project logs:", error);
      }
    };

    // Function to fetch or generate progress data
    const fetchProgressData = async () => {
      try {
        // If you have an API endpoint for progress data, use it here
        // Example:
        // const response = await AxiosInstance.get(`/projects/${id}/progress/`);
        // setProgressData(response.data);

        // Otherwise, generate dummy data (replace with your actual logic)
        const dummyProgressData = [
          { date: dayjs(project.start_date).format("YYYY-MM-DD"), progress: 0 },
          // Add data points for each time the project was edited
          { date: dayjs().format("YYYY-MM-DD"), progress: 75 }, // Example
        ];
        setProgressData(dummyProgressData);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProject();
    fetchLogs();

    // Call the function to fetch progress data AFTER fetching project
    if (project) {
      fetchProgressData();
    }
  }, [id, project]); // Dependencies: id and project

  const handleEditClick = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleOpenRequirements = () => setOpenRequirements(true);
  const handleCloseRequirements = () => setOpenRequirements(false);
  const handleOpenServiceScope = () => setOpenServiceScope(true);
  const handleCloseServiceScope = () => setOpenServiceScope(false);
  const handleOpenGeographies = () => setOpenGeographies(true);
  const handleCloseGeographies = () => setOpenGeographies(false);

  if (loading) return <p>Loading...</p>;

  // Helper function to render list items with checkmarks
  const renderListItems = (items) => {
    const itemList = Array.isArray(items)
      ? items // If it's an array, use it directly
      : items
      ? items.split(",").map((item) => item.trim())
      : []; // Split only if items is not null, otherwise use empty array

    return (
      <List>
        {itemList.map(
          (item, index) =>
            item && (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            )
        )}
      </List>
    );
  };

  // Helper function to render logs
  const renderLogs = (logs) => {
    if (!logs || logs.length === 0) {
      return <Typography>No logs available.</Typography>;
    }
    return (
      <List>
        {logs.map((log, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${log.timestamp} - ${log.user} - ${log.action}`}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box className="projectDetailsContainer">
      {project ? (
        <>
          <Typography variant="h3" className="projectTitle" style={{ fontWeight: 'bold', marginBottom: '30px' }}> 
            {project.name}
          </Typography>

          {/* Improved Tabs with Larger Font */}
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Project tabs" centered variant="fullWidth">
            <Tab label="Project Details" className="tab" style={{ fontSize: '18px' }} /> 
            <Tab label="Service Scope" className="tab" style={{ fontSize: '18px' }} /> 
            <Tab label="Portfolio Information" className="tab" style={{ fontSize: '18px' }} /> 
            <Tab label="Service Providers" className="tab" style={{ fontSize: '18px' }} /> 
            <Tab label="Logs" className="tab" style={{ fontSize: '18px' }} /> 
            <Tab label="Q&A" className="tab" style={{ fontSize: '18px' }} /> 
          </Tabs>

          {tabIndex === 0 && (
            <Box className="projectDetailsContent">

              {/* Status, Start Date, and End Date in Cards with Styling */}
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={4}>
                  <Card className="dateCard" style={{ backgroundColor: '#f0f0f5' }}> 
                    <CardContent>
                      <Typography variant="subtitle1" className="dateLabel" style={{ fontWeight: 'bold' }}>Status:</Typography>
                      <Typography variant="h6" className="dateValue" style={{ color: '#2196f3' }}>{project.status}</Typography> 
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card className="dateCard" style={{ backgroundColor: '#f0f0f5' }}>
                    <CardContent>
                      <Typography variant="subtitle1" className="dateLabel" style={{ fontWeight: 'bold' }}>Start Date:</Typography>
                      <Typography variant="h6" className="dateValue">{project.start_date}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card className="dateCard" style={{ backgroundColor: '#f0f0f5' }}>
                    <CardContent>
                      <Typography variant="subtitle1" className="dateLabel" style={{ fontWeight: 'bold' }}>End Date:</Typography>
                      <Typography variant="h6" className="dateValue">{project.end_date}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Progress Graph */}
              <div className="progressGraphContainer">
                <LineChart width={500} height={300} data={progressData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" />
                </LineChart>
              </div>
              
              {/* Buttons (View Requirements and Edit Project) */}
              <Box className="projectDetailItem">
                <Button variant="contained" color="primary" onClick={handleOpenRequirements}>
                  View Requirements
                </Button>
              </Box>
              <Dialog open={openRequirements} onClose={handleCloseRequirements}>
                <DialogTitle>Requirements</DialogTitle>
                <DialogContent>
                  {renderListItems(project.requirements)}
                </DialogContent>
              </Dialog>
              <Button variant="contained" color="primary" onClick={handleEditClick} className="editButton">
                Edit Project
              </Button>
            </Box>
          )}
          {tabIndex === 1 && (
            <Box className="checklistContent">
              <Typography variant="h6" className="projectSectionTitle">
                Service Scope
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenServiceScope}
              >
                View Service Scope
              </Button>
              <Dialog open={openServiceScope} onClose={handleCloseServiceScope}>
                <DialogTitle>Service Scope</DialogTitle>
                <DialogContent>
                  {renderListItems(project.service_scope)}
                </DialogContent>
              </Dialog>
            </Box>
          )}
          {tabIndex === 2 && (
            <Box className="PortfolioInformationContent">
              <Typography variant="h6" className="projectSectionTitle">
                Geographies
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenGeographies}
              >
                View Geographies
              </Button>
              <Dialog open={openGeographies} onClose={handleCloseGeographies}>
                <DialogTitle>Geographies</DialogTitle>
                <DialogContent>
                  {renderListItems(project.geographies)}
                </DialogContent>
              </Dialog>
            </Box>
          )}
          {tabIndex === 3 && (
            <Box className="recommendedProvidersContent">
              <Typography variant="h6" className="projectSectionTitle">
                Recommended Service Providers
              </Typography>
              {/* Add content for recommended service providers here */}
            </Box>
          )}
          {tabIndex === 4 && (
            <Box className="logsContent">
              <Typography variant="h6" className="projectSectionTitle">
                Logs
              </Typography>
              {renderLogs(logs)}
            </Box>
          )}
        </>
      ) : (
        <p>Project not found</p>
      )}
    </Box>
  );
};

export default ProjectDetails;
