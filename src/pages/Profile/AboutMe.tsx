import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import * as React from "react";
import Grid from "@mui/material/Grid";
import { Divider, Stack, Typography } from "@mui/material";
import ProLeftside from "../../components/Profile/ProLeftside";
import ProCoverImage from "../../components/Profile/ProCoverImage";

import {collection, query, getDocs, where} from "firebase/firestore"
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";
import { useParams } from "react-router-dom";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function Blog() {
  const { userId } = useParams();
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) =>
            ({
              uid: doc.id,
              ...doc.data(),
            } as User)
        );
        setInFoUser(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userId]); 

  return (
    <div>
      <Grid sx={{ flexGrow: 1 }} container marginTop={5}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            paddingLeft={5}
            paddingRight={5}
            spacing={10}
          >
            <Grid item xs={2}>
              <Item sx={{ backgroundColor: "#EEECEF" }}>
                <ProLeftside />
              </Item>
            </Grid>

            <Grid item xs={10}>
              <Item>
                <Box sx={{ width: "100%" }}>
                  <Stack spacing={2}>
                    <Item>
                      <ProCoverImage />
                    </Item>
                    <Item>
                      <Box sx={{ width: "100%" }}>
                        <Stack
                          direction="row"
                          divider={<Divider orientation="vertical" flexItem />}
                          sx={{
                            backgroundColor: "white",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Item
                            sx={{
                              padding: "50px",
                              fontSize: "30px",
                              width: "50%",
                              alignSelf: "center",
                            }}
                          >
                            About me
                          </Item>
                          {inFoUser.map((m) => ( 
                          <Item
                          key={m.uid}
                            sx={{
                              padding: "50px",
                              width: "50%",
                              textAlign: "left",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <Typography><b>Faculty:</b> {m.faculty}</Typography>
                            <Typography><b>Year:</b> {m.year}</Typography>
                            <Typography><b>Status:</b> {m.status}</Typography>
                            <Typography><b>IG:</b> {m.instagram}</Typography>
                          </Item>
                          ))}
                        </Stack>
                      </Box>
                    </Item>
                  </Stack>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
