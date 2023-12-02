import { Box } from '@mui/material';
import Host from './Host';
import { EventPost } from '../../interface/Event';

interface IData {
    evenetData: EventPost[];
    imageUrls: string[];
}

export default function LeftSideContainer({ evenetData, imageUrls }: IData) {
    return (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
            {evenetData.map((e) => (
                <Box sx={{ display: "flex", flexDirection: "column" }} key={e.eventId}>
                    <Host
                        hostId={e.owner}
                        imageUrls={imageUrls}
                    />

                </Box>
            ))}
        </Box>
    );
}
