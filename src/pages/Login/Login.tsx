// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Button, Modal, Paper } from '@mui/material';

import CMUSubLogo from '../../assets/CMU_Sub_Logo 1.png';
import CMUIcon from "../../assets/logoCmu.png";
import Privacy from '../../components/Privacy';



export default function Login() {
    // const navigate = useNavigate();
    const [openPrivacy, setOpenPrivacy] = useState(false);
    const oauthClientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
    const redirect_uri = 'https://www.cmuexplore.com/callback';
    const cmuUrl = `https://oauth.cmu.ac.th/v1/Authorize.aspx?response_type=code&client_id=${oauthClientId}&redirect_uri=${redirect_uri}&scope=cmuitaccount.basicinfo&state=xyz`;

    // const fakeData = () => {
    //     const userData = {
    //         uid: '630615022',
    //         firstName: 'TASTAI',
    //         lastName: 'KHIANHAI'
    //     };
    //     localStorage.setItem("user", JSON.stringify(userData));
    //     navigate("/");
    // };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
            <Modal
                open={openPrivacy}
            >
                <Box>
                    <Privacy handleclose={() => setOpenPrivacy(false)} />
                </Box>
            </Modal>
            <Paper sx={{ flexDirection: "column", borderRadius: '30px', width: "530px", mt: 20, pt: 10, pl: 5, pr: 5, pb: 10, backgroundColor: "#BCB3F3" }}>
                <img src={CMUSubLogo} alt="cmuLogo" />
                <Box onClick={() => setOpenPrivacy(true)} sx={{ fontSize: "20px", mt: 1, cursor: "pointer", textDecoration: 'underline' }}>
                    Please read privacy before login
                </Box>
                <Box sx={{ fontSize: "28px", mt: 3, fontFamily: "Roboto", color: "#133463" }}>
                    “ CMU EXPLORE “
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <Button
                        onClick={() => (window.location.href = cmuUrl)}
                        variant="contained"
                        sx={{ width: "60%", fontSize: "20px", fontWeight: "bold", borderRadius: "10px", color: "white" }}
                        startIcon={
                            <img src={`${CMUIcon}`} style={{ width: "40px" }} />
                        }
                    >
                        Login with CMU account
                    </Button>
                </Box>
                {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <Button
                        onClick={() => fakeData()}
                        variant="contained"
                        sx={{ width: "50%", fontSize: "20px", fontWeight: "bold" }}
                        startIcon={
                            <img src={`${CMUIcon}`} style={{ width: "40px" }} />
                        }
                    >
                        Fake CMU
                    </Button>
                </Box> */}
            </Paper>
        </Box>
    );
}
