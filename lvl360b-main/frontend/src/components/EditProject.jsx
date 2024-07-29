// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import AxiosInstance from "./AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const EditProject = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    status: "in_progress",
    requirements: [],
    start_date: "",
    end_date: "",
    service_scope: [],
    geographies: [],
    documents: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogOptions, setDialogOptions] = useState([]);
  const [dialogSelections, setDialogSelections] = useState([]);

  const requirementsOptions = [
    "Good standing w/Client",
    "CMMS - Maximo",
    "Retail client experience",
    "Multi-trade capabilities",
    "3 References - Current Clients",
    "2 References - Previous Clients",
    "Insurance",
  ];

  const serviceScopeOptions = [
    "Service Scope 1",
    "Service Scope 2",
    "Service Scope 3",
    "Service Scope 4",
  ];

  const geographyOptions = [
    "EMEA (Europe, the Middle East and Africa)",
    "NA (North America)",
    "LATAM (Latin America)",
    "APAC (Asia-Pacific)",
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await AxiosInstance.get(`projects/${projectId}/`);
        const projectData = response.data;

        // Assuming requirements, service_scope, and geographies are JSON strings
        setFormData({
          name: projectData.name,
          status: projectData.status,
          requirements: JSON.parse(projectData.requirements || "[]"),
          start_date: projectData.start_date,
          end_date: projectData.end_date,
          service_scope: JSON.parse(projectData.service_scope || "[]"),
          geographies: JSON.parse(projectData.geographies || "[]"),
          documents: projectData.documents || [],
        });
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the project!", error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: e.target.files });
  };

  const handleDialogOpen = (type) => {
    setDialogType(type);
    switch (type) {
      case "requirements":
        setDialogOptions(requirementsOptions);
        setDialogSelections(formData.requirements);
        break;
      case "serviceScope":
        setDialogOptions(serviceScopeOptions);
        setDialogSelections(formData.service_scope);
        break;
      case "geographies":
        setDialogOptions(geographyOptions);
        setDialogSelections(formData.geographies);
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
      case "requirements":
        setFormData({ ...formData, requirements: dialogSelections });
        break;
      case "serviceScope":
        setFormData({ ...formData, service_scope: dialogSelections });
        break;
      case "geographies":
        setFormData({ ...formData, geographies: dialogSelections });
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();

      // Append data to FormData, including dynamic fields
      for (let key in formData) {
        if (key === "documents") {
          for (let i = 0; i < formData.documents.length; i++) {
            updateData.append("documents", formData.documents[i]);
          }
        } else if (
          key === "requirements" ||
          key === "service_scope" ||
          key === "geographies"
        ) {
          updateData.append(key, JSON.stringify(formData[key]));
        } else {
          updateData.append(key, formData[key]);
        }
      }

      await AxiosInstance.put(`projects/${projectId}/`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Project has been updated successfully!");
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("There was an error updating the project!", error);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        m: 3,
        borderRadius: "10px",
      }}
      className="project-form"
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, color: "#3f51b5", fontWeight: "bold" }}
      >
        Edit Project
      </Typography>

      {loading ? (
        <p>Loading project...</p>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            {/* Project Name and Status (moved next to each other) */}
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Project Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}> 
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Start Date and End Date (now on the same row) */}
            <Grid item xs={12} md={6}>
              <TextField
                name="start_date"
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="end_date"
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Requirements */}
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDialogOpen("requirements")}
                startIcon={<AddIcon />}
                sx={{ mb: 2, mt: 2 }}
              >
                Requirements
              </Button>
            </Grid>

            {/* Service Scope */}
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDialogOpen("serviceScope")}
                startIcon={<AddIcon />}
                sx={{ mb: 2, mt: 2 }}
              >
                Service Scope
              </Button>
            </Grid>

            {/* Geographies */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDialogOpen("geographies")}
                startIcon={<AddIcon />}
                sx={{ mb: 2, mt: 2 }}
              >
                Geographies
              </Button>
            </Grid>

            {/* File Input */}
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*,.zip,.rar"
              style={{ margin: "16px 0" }}
            />

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3 }}
            >
              Save
            </Button>

            {/* Success Alert */}
            {successMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMessage}
              </Alert>
            )}
          </Grid>

          {/* Dialog for Selecting Options */}
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>
              Select {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
            </DialogTitle>
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
        </form>
      )}
    </Box>
  );
};

export default EditProject;