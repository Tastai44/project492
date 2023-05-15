import Grid from "@mui/material/Grid";
import EventCard from "./EventCard";

export default function EventContainer() {
  return (
    <Grid sx={{ flexGrow: 1, gap:"40px"}} container>
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

  );
}
