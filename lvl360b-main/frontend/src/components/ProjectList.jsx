import React, { useEffect, useState } from 'react';
import AxiosInstance from './AxiosInstance';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ButtonGroup, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProjectList.css'; // Import the CSS file

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                console.log(`Fetching projects with status: ${filter}`);
                const response = await AxiosInstance.get(`projects/?status=${filter}`);
                console.log('API response:', response.data);
                setProjects(response.data);
                setLoading(false);
            } catch (error) {
                console.error("There was an error fetching the projects!", error);
                setLoading(false);
            }
        };

        fetchProjects();
    }, [filter]); // Include filter in dependency array to re-fetch projects when filter changes

    // Function to handle project details navigation
    const handleProjectClick = (projectId) => {
        // Navigate to a new page with project details using project id
        navigate(`/projects/${projectId}`);
    };

    // Function to handle toggle button click
    const handleToggleFilter = (value) => {
        if (filter === value) {
            setFilter(''); // Toggle off if already selected
        } else {
            setFilter(value); // Toggle on if not selected
        }
    };

    return (
        <Box className="project-list-container">
            <Paper className="project-list-paper">
                <Typography variant="h4" gutterBottom className="project-list-heading">
                    Project List
                </Typography>
                <div className="filter-container">
                    <ButtonGroup>
                        <Button
                            variant={filter === '' ? 'contained' : 'outlined'}
                            onClick={() => handleToggleFilter('')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'in_progress' ? 'contained' : 'outlined'}
                            onClick={() => handleToggleFilter('in_progress')}
                        >
                            In Progress
                        </Button>
                        <Button
                            variant={filter === 'completed' ? 'contained' : 'outlined'}
                            onClick={() => handleToggleFilter('completed')}
                        >
                            Completed
                        </Button>
                    </ButtonGroup>
                </div>
                {loading ? <p>Loading projects...</p> : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id} onClick={() => handleProjectClick(project.id)} className="project-list-row">
                                        <TableCell>{project.name}</TableCell>
                                        <TableCell>{project.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
};

export default ProjectList;









