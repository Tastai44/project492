import { Box, Button, Typography } from '@mui/material';

import { stylePrivacyBox } from '../utils/styleBox';

interface IPrivacy {
    handleclose: () => void;
}

export default function Privacy(props: IPrivacy) {
    return (
        <div>
            <Box sx={stylePrivacyBox}>
                <Typography variant='h3' color={'black'}>
                    Privacy Policy
                </Typography>
                <Typography color={'black'} sx={{ textAlign: "justify", pb: 1 }}>
                    At CMU Explore, we are committed to protecting your privacy and personal
                    information. We may collect and securely store certain user data to enhance
                    your experience on our platform, such as name, email address, student id
                    and faculty. Your trust is of utmost importance to us, and we assure you
                    that we will never share or sell your data to third parties without your explicit consent.
                </Typography>
                <Button onClick={() => props.handleclose()} variant="contained" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                    Got it
                </Button>
            </Box>
        </div>
    );
}
