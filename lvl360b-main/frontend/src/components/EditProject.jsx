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
} from "@mui/material";

const EditProject = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    status: "in_progress",
    requirements: "",
    start_date: "",
    end_date: "",
    service_scope: "",
    geographies: "",
    documents: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await AxiosInstance.get(`projects/${projectId}/`);
        const projectData = response.data;
        setFormData({
          name: projectData.name,
          status: projectData.status,
          requirements: projectData.requirements,
          start_date: projectData.start_date,
          end_date: projectData.end_date,
          service_scope: projectData.service_scope,
          geographies: projectData.geographies,
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "documents") {
          for (let i = 0; i < formData.documents.length; i++) {
            updateData.append("documents", formData.documents[i]);
          }
        } else {
          updateData.append(key, formData[key]);
        }
      });

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
      className="project-form" // Apply the CSS class for styling
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
            <Grid item xs={12}>
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

            {/* Other TextFields (Requirements, Start Date, End Date, etc.) */}
            <Grid item xs={12} md={6}>
              <TextField
                // ... your TextField props for Requirements
                name="requirements"
                label="Requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                // ... your TextField props for Start Date
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
                // ... your TextField props for End Date
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

            <Grid item xs={12} md={6}>
              <TextField
                name="service_scope"
                label="Service Scope"
                value={formData.service_scope}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="geographies"
                label="Geographies"
                value={formData.geographies}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
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
        </form>
      )}
    </Box>
  );
};

export default EditProject;
