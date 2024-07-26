import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from './AxiosInstance';
import {
  Box, Typography, Button, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './ProjectDetails.css'; // Import the custom CSS
import dayjs from 'dayjs';

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
        console.log("Fetched logs:", response.data); // Debugging log
      } catch (error) {
        console.error("Error fetching project logs:", error);
      }
    };

    fetchProject();
    fetchLogs();
  }, [id]);

  const handleEditClick = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const calculateTimelinePosition = (startDate, endDate) => {
    const today = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const totalDays = end.diff(start, 'day');
    const daysUntilToday = today.diff(start, 'day');
    const positionPercentage = (daysUntilToday / totalDays) * 100;
    return Math.min(Math.max(positionPercentage, 0), 100); // Ensure the percentage is within 0-100%
  };

  const generateMonthLabels = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const months = [];
    let current = start.startOf('month');

    while (current.isBefore(end)) {
      const positionPercentage = (current.diff(start, 'day') / end.diff(start, 'day')) * 100;
      months.push({ month: current.format('MMM YYYY'), position: positionPercentage });
      current = current.add(1, 'month');
    }

    return months;
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
    const itemList = Array.isArray(items) ? items : items.split(',').map(item => item.trim());
    return (
      <List>
        {itemList.map((item, index) => (
          item && (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          )
        ))}
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
            <ListItemText primary={`${log.timestamp} - ${log.user} - ${log.action}`} />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box className="projectDetailsContainer">
      {project ? (
        <>
          <Typography variant="h4" className="projectTitle">{project.name}</Typography>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Project tabs">
            <Tab label="Project Details" />
            <Tab label="Service Scope" />
            <Tab label="Portfolio Information" />
            <Tab label="Service Providers" />
            <Tab label="Logs" />
            <Tab label="Q&A" />
          </Tabs>
          {tabIndex === 0 && (
            <Box className="projectDetailsContent">
              <Box className="projectDetailItem">
                <Typography variant="body1"><strong>Status:</strong> {project.status}</Typography>
                <Typography variant="body1"><strong>Start Date:</strong> {project.start_date}</Typography>
                <Typography variant="body1"><strong>End Date:</strong> {project.end_date}</Typography>
                <Box className="timeline">
                  <Box
                    className="marker"
                    style={{
                      left: `${calculateTimelinePosition(project.start_date, project.end_date)}%`
                    }}
                  ></Box>
                  {generateMonthLabels(project.start_date, project.end_date).map((monthLabel, index) => (
                    <Typography
                      key={index}
                      className="monthLabel"
                      style={{ left: `${monthLabel.position}%` }}
                    >
                      <span className="monthYearLabel">{monthLabel.month}</span>
                    </Typography>
                  ))}
                </Box>
              </Box>
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
              <Typography variant="h6" className="projectSectionTitle">Service Scope</Typography>
              <Button variant="contained" color="primary" onClick={handleOpenServiceScope}>
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
              <Typography variant="h6" className="projectSectionTitle">Geographies</Typography>
              <Button variant="contained" color="primary" onClick={handleOpenGeographies}>
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
              <Typography variant="h6" className="projectSectionTitle">Recommended Service Providers</Typography>
              {/* Add content for recommended service providers here */}
            </Box>
          )}
          {tabIndex === 4 && (
            <Box className="logsContent">
              <Typography variant="h6" className="projectSectionTitle">Logs</Typography>
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



















