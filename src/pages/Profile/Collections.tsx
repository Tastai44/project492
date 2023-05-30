import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";
import { Divider, Paper, Stack } from "@mui/material";
import ProLeftside from "../../components/Profile/ProLeftside";
import ProCoverImage from "../../components/Profile/ProCoverImage";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Navigation";
import SearchIcon from "@mui/icons-material/Search";
import CollectionCard from "../../components/Profile/CollectionCard";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function Collections() {
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
                  <Stack>
                    <Item>
                      <ProCoverImage />
                    </Item>
                    <Item>
                      <Box sx={{ width: "100%" }}>
                        <Paper
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ m: 1, fontSize: "20px" }}>
                              Collections
                            </Box>
                            <Search sx={{ backgroundColor: "#F1F1F1", m: 1 }}>
                              <SearchIconWrapper>
                                <SearchIcon />
                              </SearchIconWrapper>
                              <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ "aria-label": "search" }}
                              />
                            </Search>
                          </Box>
                          <Divider light sx={{ background: "grey", mb: 1 }} />
                          <Grid sx={{ flexGrow: 1, gap: 1 }} container>
                            <CollectionCard />
                            <CollectionCard />
                            <CollectionCard />
                            <CollectionCard />
                            <CollectionCard />
                            <CollectionCard />
                            <CollectionCard />
                            <CollectionCard />
                          </Grid>
                        </Paper>
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
