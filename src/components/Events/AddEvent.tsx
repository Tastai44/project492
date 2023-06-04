import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Ihandle {
  closeEdit: () => void;
}

export default function AddEvent({ closeEdit }: Ihandle) {

  return (
    <div style={{ color: "black" }}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5">
          Add an event
        </Typography>
        <Divider sx={{ background: "grey" }} />
        <Box sx={{ mt: 1 }}>
          <TextField
            sx={{ width: "100%" }}
            id="outlined-basic"
            label="Title"
            variant="outlined"
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker"]}
                sx={{ mb: 1, width: "50%" }}
              >
                <DemoItem>
                  <DatePicker label={"Start Date"} />
                </DemoItem>
              </DemoContainer>
              <DemoContainer
                components={["DatePicker"]}
                sx={{ mb: 1, width: "50%" }}
              >
                <DemoItem>
                  <TimePicker label={"Start Time"} />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker"]}
                sx={{ mb: 1, width: "50%" }}
              >
                <DemoItem>
                  <DatePicker label={"End Date"} />
                </DemoItem>
              </DemoContainer>
              <DemoContainer
                components={["DatePicker"]}
                sx={{ mb: 1, width: "50%" }}
              >
                <DemoItem>
                  <TimePicker label={"End Time"} />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          <TextField
            sx={{ width: "100%", mb: 1 }}
            id="outlined-basic"
            label="Location"
            variant="outlined"
            type="text"
          />
          <TextField
            sx={{ width: "100%", mb: 1 }}
            id="outlined-basic"
            label="#Topic"
            variant="outlined"
            multiline
          />
          <TextField
            sx={{ width: "100%", mb: 1 }}
            id="outlined-basic"
            label="Rage Age"
            type="number"
            variant="outlined"
            multiline
          />
          <TextField
            sx={{ width: "100%", mb: 1 }}
            id="outlined-basic"
            label="Details"
            variant="outlined"
            multiline
          />
          <FormControl sx={{ width: "100%", mb: 1 }} variant="outlined">
            <OutlinedInput
              id="outlined-insertPhoto"
              type={"file"}
              inputProps={{ "aria-label": " " }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="start">
                    <InsertPhotoIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Typography
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button
            sx={{
              backgroundColor: "grey",
              color: "white",
              "&:hover": {
                color: "black",
                backgroundColor: "#E1E1E1",
              },
            }}
            onClick={closeEdit}
          >
            Cancel
          </Button>
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
            Save
          </Button>
        </Typography>
      </Box>
    </div>
  );
}
