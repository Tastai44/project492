import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";

import DetailCard from "../../components/Events/DetailCard";
import LeftSideContainer from "../../components/Events/LeftSideContainer";
import HeldMap from "../../components/Events/HeldMap";
import CoverPhoto from "../../components/Events/CoverPhoto";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function EventDetail() {
  return (
    <div>
      <Grid sx={{ flexGrow: 1 }} container marginTop={5}>
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
                <Stack spacing={2}>
                  <Item sx={{mb:0}}>
                    <CoverPhoto />
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
                            <DetailCard />
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
    </div>
  );
}
