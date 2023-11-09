import Grid from "@mui/material/Grid";
import EventCard from "./EventCard";
import { Box } from "@mui/material";
import { EventPost } from "../../interface/Event";

interface IData {
    searchValue: string;
    refresh: number;
    interested: boolean;
    eventData: EventPost[];
}

export default function EventContainer(props: IData) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");

    return (
        <Box sx={{
            display: "flex"
        }}>
            {props.searchValue == "" ? (
                <Grid sx={{ flexGrow: 1, gap: "40px" }} container>
                    <>
                        {
                            props.interested ? (
                                props.eventData.filter((event) => event.interest.some((inter) => inter.interestBy == userInfo.uid)).map((event) => (
                                    <Box key={event.eventId}>
                                        <EventCard
                                            title={event.title}
                                            startDate={event.startDate}
                                            startTime={event.startTime}
                                            endDate={event.endDate}
                                            endTime={event.endTime}
                                            eventId={event.eventId}
                                            coverPhoto={event.coverPhoto}
                                            ownerId={event.owner}
                                        />
                                    </Box>
                                ))
                            ) : (
                                props.eventData.map((event) => (
                                    <Box key={event.eventId}>
                                        <EventCard
                                            title={event.title}
                                            startDate={event.startDate}
                                            startTime={event.startTime}
                                            endDate={event.endDate}
                                            endTime={event.endTime}
                                            eventId={event.eventId}
                                            coverPhoto={event.coverPhoto}
                                            ownerId={event.owner}
                                        />
                                    </Box>
                                ))
                            )
                        }
                    </>
                </Grid>
            ) : (
                <Grid sx={{ flexGrow: 1, gap: "40px" }} container>
                    {props.eventData.filter((item) => item.title.includes(props.searchValue) || item.topic.includes(props.searchValue)).map((event) => (
                        <Box key={event.eventId}>
                            <EventCard
                                title={event.title}
                                startDate={event.startDate}
                                startTime={event.startTime}
                                endDate={event.endDate}
                                endTime={event.endTime}
                                eventId={event.eventId}
                                coverPhoto={event.coverPhoto}
                                ownerId={event.owner}
                            />
                        </Box>
                    ))}
                </Grid>
            )}

        </Box>
    );
}
