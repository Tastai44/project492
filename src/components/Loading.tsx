import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import { styleLoading } from '../utils/styleBox';

interface ILoading {
    openLoading: boolean;
}

export default function Loading(props: ILoading) {
    return (
        <>
            <Modal
                open={props.openLoading}
            >
                <Box sx={styleLoading}>
                    <CircularProgress disableShrink size={80} color="inherit" sx={{ color: "#ECD0FF" }} />
                    <Typography variant='h5'>
                        Please wait...
                    </Typography>
                </Box>
            </Modal>
        </ >
    );
}
