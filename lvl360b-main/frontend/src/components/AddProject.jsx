import React, { useState } from 'react';
import AxiosInstance from './AxiosInstance';
import { TextField, Button, Box, Alert, Select, MenuItem, FormControl, InputLabel, FormGroup, FormControlLabel, Checkbox, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddProject = () => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('in_progress');
    const [selectedRequirements, setSelectedRequirements] = useState([]);
    const [selectedServiceScope, setSelectedServiceScope] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedGeographies, setSelectedGeographies] = useState([]);
    const [files, setFiles] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [dialogOptions, setDialogOptions] = useState([]);
    const [dialogSelections, setDialogSelections] = useState([]);

    const requirementsOptions = [
        'Good standing w/Client',
        'CMMS - Maximo',
        'Retail client experience',
        'Multi-trade capabilities',
        '3 References - Current Clients',
        '2 References - Previous Clients',
        'Insurance',


    ];

    const serviceScopeOptions = [
        'Service Scope 1',
        'Service Scope 2',
        'Service Scope 3',
        'Service Scope 4',
    ];

    const geographyOptions = [
        'EMEA (Europe, the Middle East and Africa)',
        'NA (North America)',
        'LATAM (Latin America)',
        'APAC (Asia-Pacific)',
    ];

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleRequirementChange = (event) => {
        const value = event.target.name;
        setSelectedRequirements((prev) =>
            prev.includes(value)
                ? prev.filter((requirement) => requirement !== value)
                : [...prev, value]
        );
    };

    const handleServiceScopeChange = (event) => {
        const value = event.target.name;
        setSelectedServiceScope((prev) =>
            prev.includes(value)
                ? prev.filter((scope) => scope !== value)
                : [...prev, value]
        );
    };

    const handleGeographiesChange = (event) => {
        setSelectedGeographies(event.target.value);
    };

    const handleDialogOpen = (type) => {
        setDialogType(type);
        switch (type) {
            case 'requirements':
                setDialogOptions(requirementsOptions);
                setDialogSelections(selectedRequirements);
                break;
            case 'serviceScope':
                setDialogOptions(serviceScopeOptions);
                setDialogSelections(selectedServiceScope);
                break;
            case 'geographies':
                setDialogOptions(geographyOptions);
                setDialogSelections(selectedGeographies);
                break;
            default:
                break;
        }
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogSave = () => {
        switch (dialogType) {
            case 'requirements':
                setSelectedRequirements(dialogSelections);
                break;
            case 'serviceScope':
                setSelectedServiceScope(dialogSelections);
                break;
            case 'geographies':
                setSelectedGeographies(dialogSelections);
                break;
            default:
                break;
        }
        setDialogOpen(false);
    };

    const handleDialogSelectionChange = (event) => {
        const value = event.target.name;
        setDialogSelections((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('status', status);
            formData.append('start_date', startDate);
            formData.append('end_date', endDate);
            formData.append('requirements', JSON.stringify(selectedRequirements));
            formData.append('service_scope', JSON.stringify(selectedServiceScope));
            formData.append('geographies', JSON.stringify(selectedGeographies));
            
            // Append files to FormData
            for (let i = 0; i < files.length; i++) {
                formData.append('documents', files[i]);  // Make sure 'documents' matches the field name in Django Project model
            }
            
            // Use AxiosInstance or your Axios configuration to send POST request
            await AxiosInstance.post('/projects/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Clear form state and display success message
            setSuccessMessage('Project has been added successfully!');
            setName('');
            setStatus('in_progress');
            setSelectedRequirements([]);
            setSelectedServiceScope([]);
            setStartDate('');
            setEndDate('');
            setSelectedGeographies([]);
            setFiles([]);
        } catch (error) {
            console.error('Error adding project:', error);
            // Handle error state if needed
        }
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            className="project-form" 
            sx={{ 
                p: 3, 
                m: 3, 
                borderRadius: '10px'
            }}
        >
            <Typography variant="h4" sx={{ mb: 3, color: '#3f51b5', fontWeight: 'bold' }}>
                Add New Project
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField 
                        label="Project Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined" 
                        InputLabelProps={{ style: { fontSize: 16 } }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel id="status-label" style={{ fontSize: 16 }}>Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {/* Date Fields */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                </Grid>
            </Grid> 

            {/* Requirements and Service Scope */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDialogOpen('requirements')}
                        startIcon={<AddIcon />}
                        sx={{ mb: 2, mt: 2 }}
                    >
                        Requirements
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDialogOpen('serviceScope')}
                        startIcon={<AddIcon />}
                        sx={{ mb: 2, mt: 2 }}
                    >
                        Service Scope
                    </Button>
                </Grid>
            </Grid>

            {/* Geographies */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDialogOpen('geographies')}
                        startIcon={<AddIcon />}
                        sx={{ mb: 2, mt: 2 }}
                    >
                        Geographies
                    </Button>
                </Grid>
            </Grid>

            {/* File Input */}
            <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*,.zip,.rar"
                style={{ margin: '16px 0' }}
            />

            {/* Submit Button */}
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
                Add Project
            </Button>

            {/* Success Alert */}
            {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {successMessage}
                </Alert>
            )}

            {/* Dialog for Selecting Options */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Select {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {dialogOptions.map((option) => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={dialogSelections.includes(option)}
                                        onChange={handleDialogSelectionChange}
                                        name={option}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleDialogSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddProject;



