import '../App.css';
import { React, useState } from 'react';
import { Box } from '@mui/material';
import MyTextField from './forms/MyTextField';
import MyPassField from './forms/MyPassField';
import MyButton from './forms/MyButton';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AxiosInstance from './AxiosInstance';
import { useNavigate } from 'react-router-dom';
import MyMessage from './Message';

// Import the logo image
import lvl360logo from '../assets/lvl360logo.png';
import './Login.css'; 


const Login = () => {
    const navigate = useNavigate();
    const { handleSubmit, control } = useForm();
    const [ShowMessage, setShowMessage] = useState(false);

    const submission = (data) => {
        AxiosInstance.post(`login/`, {
            email: data.email,
            password: data.password,
        })
        .then((response) => {
            console.log(response);
            localStorage.setItem('Token', response.data.token);
            navigate(`/home`);
        })
        .catch((error) => {
            setShowMessage(true);
            console.error('Error during login', error);
        });
    };

    return (
        <div className={"myBackground"}>
            {ShowMessage ? <MyMessage text={"Login has failed, please try again, or reset your password"} color={'#EC5A76'} /> : null}
            <form onSubmit={handleSubmit(submission)}>
                <Box className={"whiteBox"}>
                    {/* Add the logo image above the welcome message */}
                    <Box className={"itemBox"}>
                        <img src={lvl360logo} alt="lvl360 Logo" className="logoImage" />
                    </Box>

                    <Box className={"itemBox"}>
                        <Box className={"title"}> Welcome back to lvl360! </Box>
                    </Box>

                    <Box className={"itemBox"}>
                        <MyTextField
                            label={"Email"}
                            name={"email"}
                            control={control}
                        />
                    </Box>

                    <Box className={"itemBox"}>
                        <MyPassField
                            label={"Password"}
                            name={"password"}
                            control={control}
                        />
                    </Box>

                    <Box className={"itemBox"}>
                        <MyButton
                            label={"Login"}
                            type={"submit"}
                        />
                    </Box>

                    <Box className={"itemBox"} sx={{ flexDirection: 'column' }}>
                        <Link to="/register"> No account yet? Please register! </Link>
                        <Link to="/request/password_reset"> Password forgotten? Click here </Link>
                    </Box>
                </Box>
            </form>
        </div>
    );
}

export default Login;
