import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Avatar, Box } from '@mui/material';
import AxiosInstance from './AxiosInstance';
import './UserProfile.css';

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    profile_picture: '',
    send_notifications: false,
  });
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await AxiosInstance.get('users/');
        setProfileData(response.data);
        setProfilePicture(response.data.profile_picture);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(URL.createObjectURL(e.target.files[0]));
      setProfileData({
        ...profileData,
        profile_picture: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append updated profile data to FormData
    for (const key in profileData) {
      if (key === 'profile_picture' && profileData.profile_picture instanceof File) {
        formData.append('profile_picture', profileData.profile_picture);
      } else {
        formData.append(key, profileData[key]);
      }
    }

    try {
      const response = await AxiosInstance.put(`users/${profileData.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileData(response.data);
      setProfilePicture(response.data.profile_picture);
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <p>Loading profile data...</p>;

  return (
    <Container component="main" maxWidth="md" className="user-profile-container">
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, color: '#3f51b5', fontWeight: 'bold' }}>
        Personal Information
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              value={profileData.first_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              value={profileData.last_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email ID"
              name="email"
              value={profileData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              id="phone"
              label="Phone"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
            />
          </Grid>

          {/* Profile Picture Section */}
          <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Avatar src={profilePicture} sx={{ width: 100, height: 100 }} />
            </Grid>
            <Grid item>
              <input 
                accept="image/*"
                id="profile-picture"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="profile-picture">
                <Button variant="contained" color="primary" component="span">
                  Upload Profile Picture
                </Button>
              </label>
            </Grid>
          </Grid>

          {/* Save Changes Button */}
          <Grid item xs={12} container justifyContent="center">
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default UserProfile;








