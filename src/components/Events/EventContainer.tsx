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

export default function EventContainer() {
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
            <Grid sx={{ flexGrow: 1, gap: "40px" }} container>
                {eventData.map((m) => (
                    <Box key={m.eventId}>
                        <EventCard
                            title={m.title}
                            startDate={m.startDate}
                            startTime={m.startTime}
                            endDate={m.endDate}
                            endTime={m.endTime}
                            eventId={m.eventId}
                            coverPhoto={m.coverPhoto}
                            ownerId={m.owner}
                        />
                    </Box>
                ))}
            </Grid>
        </Box>
    );
}
