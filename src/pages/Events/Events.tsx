import * as React from "react";
import { Button, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import EventContainer from "../../components/Events/EventContainer";
import AddEvent from "../../components/Events/AddEvent";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Events() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [reFresh, setReFresh] = React.useState(0);
  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddEvent 
            closeAdd={handleClose} 
            handleRefresh={handleRefresh}
          />
        </Box>
      </Modal>
      <Box sx={{ width: "100%", marginTop: 7 }}>
        <Stack spacing={2}>
          <Item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ fontSize: "30px", color: "#920EFA", fontWeight: 500 }}
            >
              CMU Events
            </div>
            <Button
              sx={{
                fontSize: "16px",
                "&:hover": { backgroundColor: "white", color: "black" },
                borderRadius: "10px",
                backgroundColor: "#A020F0",
                padding: "5px",
                color: "#fff",
              }}
              onClick={handleOpen}
            >
              Add an event
            </Button>
          </Item>
          <Item sx={{ display: "flex", justifyContent: "center" }}>
            <EventContainer 
              reFresh={reFresh}
            />
          </Item>
        </Stack>
      </Box>
    </>
  );
}
