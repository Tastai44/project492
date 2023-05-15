import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";
import { Divider, Stack, Typography } from "@mui/material";
import ProLeftside from "../../components/Profile/ProLeftside";
import ProCoverImage from "../../components/Profile/ProCoverImage";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function Blog() {
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
                          <Item
                            sx={{
                              padding: "50px",
                              width: "50%",
                              textAlign: "left",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <Typography><b>Faculty:</b> Engineering</Typography>
                            <Typography><b>Year:</b> 3</Typography>
                            <Typography><b>Lives in:</b> Chiang mai </Typography>
                            <Typography><b>From:</b> Chiang mai </Typography>
                            <Typography><b>Phone:</b> 0000000000</Typography>
                            <Typography><b>Status:</b> Single</Typography>
                            <Typography><b>IG:</b> igigiggi</Typography>
                          </Item>
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
