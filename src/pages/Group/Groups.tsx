import * as React from "react";
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
      <GroupContainer openAddGroup={handleOpen}/>
    </>
  );
}
