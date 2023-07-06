import * as React from "react";
import Grid from "@mui/material/Grid";
import EventCard from "./EventCard";
import { Box } from "@mui/material";
import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { EventPost } from "../../interface/Event";

interface IData {
  reFresh: number;
}

export default function EventContainer({reFresh} : IData) {

  const [data, setData] = React.useState<EventPost[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "events"),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) => doc.data() as EventPost
        );
        setData(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reFresh]);
  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "95%" }}>
      <Grid sx={{ flexGrow: 1, gap: "40px" }} container>
        {data.map((m) => (
          <Box key={m.id}>
            <EventCard 
              title={m.title}
              startDate={m.startDate}
              startTime={m.startTime}
              endDate={m.endDate}
              endTime={m.endTime}
              eventId={m.id}
              coverPhoto={m.coverPhoto}
            />
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
