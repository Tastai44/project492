import * as React from "react";
import Grid from "@mui/material/Grid";
import EventCard from "./EventCard";
import { Box } from "@mui/material";
import { dbFireStore } from "../../config/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import { EventPost } from "../../interface/Event";

interface IData {
    searchValue: string;
}

export default function EventContainer(props: IData) {
    const [eventData, setEventData] = React.useState<EventPost[]>([]);
    React.useEffect(() => {
        const fetchData = query(
            collection(dbFireStore, "events"),
            orderBy("createAt", "desc")
        );
        const unsubscribe = onSnapshot(
            fetchData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as EventPost);
                setEventData(queriedData);
            },
            (error) => {
                console.error("Error fetching data", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, []);
    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "95%" }}>
            {props.searchValue == "" ? (
                <Grid sx={{ flexGrow: 1, gap: "40px" }} container>
                    {eventData.map((event) => (
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
            ) : (
                <Grid sx={{ flexGrow: 1, gap: "40px" }} container>
                    {eventData.filter((item) => item.title.includes(props.searchValue) || item.topic.includes(props.searchValue)).map((event) => (
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
