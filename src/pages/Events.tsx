// import * as React from 'react';
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import EventContainer from "../components/Events/EventContainer";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Events() {
  return (
    <Box sx={{ width: "100%", marginTop: 7 }}>
      <Stack spacing={2}>
        <Item
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "30px", color: "#920EFA", fontWeight: 500 }}>
            CMU Events
          </div>
          <Button
            sx={{
              fontSize: "16px",
              "&:hover": { backgroundColor: "#e8e8e8", color: "black" },
              borderRadius: "10px",
              backgroundColor: "#A020F0",
              padding: "5px",
              color: "#fff",
            }}
          >
            Add an event
          </Button>
        </Item>
        <Item>
          <EventContainer />
        </Item>
      </Stack>
    </Box>
  );
}
