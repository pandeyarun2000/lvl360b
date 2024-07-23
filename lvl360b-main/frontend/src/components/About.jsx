import React, { useEffect, useState } from 'react';
import AxiosInstance from './AxiosInstance';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, CircularProgress, Button, Modal, TextField } from '@mui/material';
import './About.css'; // Import the CSS file

const About = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await AxiosInstance.get('all-users/');
                setUsers(response.data);
            } catch (error) {
                console.error("There was an error fetching the users!", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setMessage('');
    };

    const handleSendMessage = () => {
        // Implement the message sending functionality here
        console.log(`Message sent to ${selectedUser.first_name} ${selectedUser.last_name}: ${message}`);
        handleClose();
    };

    return (
        <Box className="about-container">
            <Paper className="about-paper">
                <Typography variant="h4" gutterBottom className="about-heading">
                    About
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : users.length === 0 ? (
                    <Typography variant="body1" align="center">No users found</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="about-table-header">Profile Picture</TableCell>
                                    <TableCell className="about-table-header">Name</TableCell>
                                    <TableCell className="about-table-header">Email</TableCell>
                                    <TableCell className="about-table-header">Phone</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} onClick={() => handleUserClick(user)} className="about-row">
                                        <TableCell>
                                            <Avatar alt={`${user.first_name} ${user.last_name}`} src={user.profile_picture_url}/>
                                        </TableCell>
                                        <TableCell>{user.first_name} {user.last_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
            <Modal open={open} onClose={handleClose}>
                <Box className="modal-box">
                    <Typography variant="h6" gutterBottom>Send a message to {selectedUser?.first_name} {selectedUser?.last_name}</Typography>
                    <TextField
                        label="Message"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Box display="flex" justifyContent="flex-end" marginTop={2}>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button onClick={handleSendMessage} color="primary" variant="contained" style={{ marginLeft: '10px' }}>Send</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default About;













