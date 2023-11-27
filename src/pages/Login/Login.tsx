import { useState } from 'react';
import { Box, Button, Modal, Paper } from '@mui/material';

import CMUSubLogo from '../../assets/CMU_Sub_Logo 1.png';
import CMUIcon from "../../assets/logoCmu.png";
import Privacy from '../../components/Privacy';
import { themeApp } from '../../utils/Theme';

export default function Login() {
    const [openPrivacy, setOpenPrivacy] = useState(false);
    const cmuLogin = import.meta.env.VITE_OAUTH;
    const oauthClientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
    const redirect_uri = `${import.meta.env.VITE_CLIENT_ENDPOINT}callback`;
    const cmuUrl = `${cmuLogin}?response_type=code&client_id=${oauthClientId}&redirect_uri=${redirect_uri}&scope=cmuitaccount.basicinfo&state=xyz`;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
            <Modal
                open={openPrivacy}
            >
                <Box>
                    <Privacy handleclose={() => setOpenPrivacy(false)} />
                </Box>
            </Modal>
            <Paper sx={{
                flexDirection: "column", borderRadius: '30px', width: "530px", mt: 20, pt: 10, pl: 5, pr: 5, pb: 10, backgroundColor: "#BCB3F3", [themeApp.breakpoints.down("lg")]: {
                    mt: 7
                }
            }}>
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
                        sx={{
                            width: "60%", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", color: "white", [themeApp.breakpoints.down("lg")]: {
                                width: "100%",
                                fontSize: "14px"
                            }
                        }}
                        startIcon={
                            <img src={`${CMUIcon}`} style={{ width: "40px" }} />
                        }
                    >
                        Login with CMU account
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
