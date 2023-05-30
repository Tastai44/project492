import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import PublicIcon from '@mui/icons-material/Public';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  color: "black",
  p: 4,
};

interface IHandle {
    handleCloseCratePost: () => void;
}

export default function CreatePost({handleCloseCratePost} : IHandle) {
  const [status, setStatus] = React.useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  return (
    <div>
      <Box sx={style}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box id="modal-modal-title" sx={{ fontSize: "25px", fontWeight:"500" }}>
            Create A Post
          </Box>
          <Box>
            <IconButton onClick={handleCloseCratePost}>
              <CancelIcon />
            </IconButton>
          </Box>
        </Box>
        <Box>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                src={Luffy}
                sx={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ fontSize: "16px" }}>
                  <b>User Name</b> is feeling happy 😁 <br />
                  <FormControl sx={{ width: "130px" }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      sx={{ height: "40px" }}
                      onChange={handleChange}
                    >
                      <MenuItem value={"Private"}>  <Box sx={{display:"flex", alignContent:"end", gap:0.5}}> <LockIcon /> Private</Box> </MenuItem>
                      <MenuItem value={"Friend"}> <Box sx={{display:"flex", alignContent:"end", gap:0.5}}><GroupIcon /> Friend </Box></MenuItem>
                      <MenuItem value={"Public"}> <Box sx={{display:"flex", alignContent:"end", gap:0.5}}><PublicIcon /> Public </Box></MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              }
            />
          </ListItem>
          <Box sx={{ width: "98%" }}>
            <TextField
              id="outlined-basic"
              label="What is in your mind?"
              variant="outlined"
              multiline
              maxRows={4}
              sx={{
                width: "99%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton>
                <InsertPhotoIcon sx={{ color: "green" }} />
              </IconButton>
              <IconButton>
                <LocationOnIcon color="error" />
              </IconButton>
              <IconButton>
                <EmojiEmotionsIcon sx={{ color: "#FCE205" }} />
              </IconButton>
            </Box>
            <Box>
              <Button
                sx={{
                  backgroundColor: "#8E51E2",
                  color: "white",
                  "&:hover": {
                    color: "black",
                    backgroundColor: "#E1E1E1",
                  },
                }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
