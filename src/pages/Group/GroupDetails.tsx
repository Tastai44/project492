import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";

import CoverPhoto from "../../components/Groups/CoverPhoto";
import LeftSideContainer from "../../components/Groups/LeftSideContainer";
import MContainer from "../../components/MContainer/MContainer";
import AboutGroup from "../../components/Groups/AboutGroup";
import { useParams } from "react-router-dom";
import { Item } from "../../App";

import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { IGroup } from "../../interface/Group";
import { User } from "../../interface/User";
import PostGroupForm from "../../components/Groups/PostGroupForm";

interface IData {
  inFoUser: User[];
}

export default function GroupDetails({ inFoUser }: IData) {
  const { groupId } = useParams();
  const [data, setData] = React.useState<IGroup[]>([]);
  const [reFresh, setReFresh] = React.useState(0);
  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "groups"),
          where("gId", "==", groupId),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) => doc.data() as IGroup
        );
        setData(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reFresh, groupId]);
  return (
    <div>
      {data.map((g) => (
        <Grid key={g.gId} sx={{ flexGrow: 1 }} container marginTop={5}>
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
                        coverPhoto={g.coverPhoto}
                        createAt={g.createAt}
                        title={g.groupName}
                        members={g.members}
                      />
                    </Item>
                    <Item>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={2.5}>
                            <Item>
                              <LeftSideContainer
                                hostId={g.hostId}
                                members={g.members}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={7}>
                            <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
                              <PostGroupForm
                                handdleReFresh={handleRefresh}
                                inFoUser={inFoUser}
                                groupName={g.groupName}
                              />
                            </Item>
                            <Item>{/* <MContainer /> */}</Item>
                          </Grid>
                          <Grid item xs={2.5}>
                            <Item>
                              <AboutGroup details={g.details} />
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
