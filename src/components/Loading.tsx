import { Box, CircularProgress, Modal } from '@mui/material';
import { styleLoading } from '../utils/styleBox';

interface ILoading {
    openLoading: boolean;
}

export default function Loading(props: ILoading) {
    return (
        <div>
            <Modal
                open={props.openLoading}
            >
                {/* <Box sx={styleLoading}> */}
                <CircularProgress disableShrink />
                {/* </Box> */}
            </Modal>
        </div >
    );
}
