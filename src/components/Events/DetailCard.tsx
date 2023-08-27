import { Box, Button, Divider, Modal, Paper } from "@mui/material";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";

import Tooltip from "@mui/material/Tooltip";
import EventReportCard from "../Report/EventReportCard";
import React from "react";

interface IData {
    details: string;
    eventId: string;
}

export default function DetailCard(props: IData) {
    const [openReportPost, setOpenReportPost] = React.useState(false);
    const handletOpenReport = () => {
        setOpenReportPost(true);
    };
    const handleCloseReport = () => setOpenReportPost(false);
    return (
        <Box sx={{ width: "100%" }}>
            <Modal
                open={openReportPost}
                onClose={handleCloseReport}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <EventReportCard
                        handleCloseReport={handleCloseReport}
                        eventId={props.eventId}
                    />
                </Box>
            </Modal>
            <Paper sx={{ p: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                    }}
                >
                    <div style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}>
                        Details
                    </div>
                    <Tooltip title="Report" sx={{ color: "black" }}>
                        <Button onClick={handletOpenReport} startIcon={<FlagCircleIcon />}>Report</Button>
                    </Tooltip>
                </Box>
                <Divider />
                <Box sx={{ textAlign: "left" }}>
                    <Box sx={{ m: 2, textAlign: "justify" }}>{props.details}</Box>
                </Box>
            </Paper>
        </Box>
    );
}
