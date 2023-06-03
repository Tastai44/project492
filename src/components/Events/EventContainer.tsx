import Grid from "@mui/material/Grid";
import EventCard from "./EventCard";
import { Box } from "@mui/material";

export default function EventContainer() {
  return (
    <Box sx={{display:"flex", justifyContent:"center", width:"95%"}}>
    <Grid sx={{ flexGrow: 1, gap:"40px" }} container>
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
    </Grid>
    </Box>

  );
}
