import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";

import DetailCard from "../../components/Events/DetailCard";
import LeftSideContainer from "../../components/Events/LeftSideContainer";
import HeldMap from "../../components/Events/HeldMap";
import CoverPhoto from "../../components/Events/CoverPhoto";

import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { EventPost } from "../../interface/Event";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function EventDetail() {
  const { eventId } = useParams();
  const [reFresh, setReFresh] = React.useState(0);
  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };
  const [data, setData] = React.useState<EventPost[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "events"),
          where("id", "==", eventId),
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
  }, [reFresh, eventId]);
  return (
    <div>
      {data.map((e) => (
      <Grid key={e.id} sx={{ flexGrow: 1 }} container marginTop={5}>
        <Grid
          container
          justifyContent="space-between"
          paddingLeft={5}
          paddingRight={5}
          spacing={10}
        >
          <Grid item xs={12}>
            <Item>
              <Box sx={{ width: "100%" }}>
                <Stack>
                  <Item sx={{ mb: 0 }}>
                    <CoverPhoto 
                      coverPhoto={e.coverPhoto}
                      title={e.title}
                      startDate={e.startDate}
                      startTime={e.startTime}
                      eventId={e.id}
                      endDate= {e.endDate}
                      endTime= {e.endTime}
                      topic={e.topic}
                      ageRage={e.ageRage}
                    />
                  </Item>
                  <Item>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={2.5}>
                          <Item>
                            <LeftSideContainer />
                          </Item>
                        </Grid>
                        <Grid item xs={7}>
                          <Item>
                            <DetailCard 
                              details={e.details}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={2.5}>
                          <Item>
                            <HeldMap />
                          </Item>
                        </Grid>
                      </Grid>
                    </Box>
                  </Item>
                </Stack>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Grid>
      ))}
    </div>
  );
}
