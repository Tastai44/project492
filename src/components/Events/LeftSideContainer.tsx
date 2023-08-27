import { Box } from '@mui/material';
import Host from './Host';
import InterestedContainer from './InterestedContainer';
import { EventPost } from '../../interface/Event';

interface IData {
    evenetData: EventPost[];
}

export default function LeftSideContainer({ evenetData }: IData) {
    return (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
            {evenetData.map((e) => (
                <Box sx={{ display: "flex", flexDirection: "column" }} key={e.eventId}>
                    <Host
                        hostId={e.owner}
                    />
                    <InterestedContainer
                        interestedPeople={e.interest}
                    />
                </Box>
            ))}
        </Box>
    );
}
