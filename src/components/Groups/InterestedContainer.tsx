import * as React from "react";
import { Paper, Divider, Box, Typography, Button, Modal } from "@mui/material";
import UserCard from "../RightSide/UserCard";
import { IMember } from "../../interface/Group";
import { NavLink } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddMembers from "./AddMembers";
interface IData {
  members: IMember[];
  gId: string;
}
interface IFunction {
  handleRefresh: () => void;
}
export default function InterestedContainer(props: IData & IFunction) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddMembers gId={props.gId} handleClose={handleClose} handleRefresh={props.handleRefresh}/>
        </Box>
      </Modal>
      <Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 5 }}>
            <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
              Members
            </Typography>
            <Button onClick={handleOpen} startIcon={<AddCircleOutlineOutlinedIcon />}>Add</Button>
          </Box>
        </Box>
        <Divider light />
        {props.members.map((m) => (
          <Box key={m.uid}>
            <NavLink to={`/profileBlog/${m.uid}`} style={{ color: "black" }}>
              <UserCard username={m.username} />
            </NavLink>
          </Box>
        ))}
      </Paper>
    </div>
  );
}
