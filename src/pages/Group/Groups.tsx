import * as React from "react";
import Grid from "@mui/material/Grid";
import LeftSide from "../../components/LeftSide";
import RightContainer from "../../components/RightSide/RightContainer";
import GroupContainer from "../../components/Groups/GroupContainer";
import { Modal, Box } from "@mui/material";
import AddGroup from "../../components/Groups/AddGroup";

export default function Groups() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddGroup closeEdit={handleClose} />
        </Box>
      </Modal>
      <Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            paddingLeft={5}
            paddingRight={5}
          >
            <Grid item xs={2}>
              <div style={{ position: "fixed" }}>
                <LeftSide />
              </div>
            </Grid>

            <Grid item xs={7}>
              <GroupContainer openAddGroup={handleOpen}/>
            </Grid>

            <Grid item xs={2}>
              <div style={{ position: "fixed" }}>
                <RightContainer />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
