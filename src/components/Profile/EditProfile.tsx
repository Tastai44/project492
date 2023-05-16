import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import React from "react";

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

export default function BasicModal() {
  const [year, setYear] = React.useState("");
  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  const [status, setStatus] = React.useState("");
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  return (
    <div style={{ color: "black" }}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5">
          Edit Profile
        </Typography>
        <Divider sx={{ background: "grey" }} />
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              sx={{ width: 400, mb: 1 }}
              id="outlined-basic"
              label="FirstName"
              variant="outlined"
            />
            <TextField
              sx={{ width: 400, mb: 1 }}
              id="outlined-basic"
              label="LastName"
              variant="outlined"
            />
          </Box>
          <TextField
            sx={{ width: 400, mb: 1 }}
            id="outlined-basic"
            label="Username"
            variant="outlined"
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={year}
                label="Age"
                onChange={handleChangeYear}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Age"
                onChange={handleChangeStatus}
              >
                <MenuItem value={1}>Single</MenuItem>
                <MenuItem value={2}>In relationship</MenuItem>
                <MenuItem value={3}>Undefined</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            sx={{ width: 400, mb: 1 }}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type="email"
          />
          <TextField
            sx={{ width: 400, mb: 1 }}
            id="outlined-basic"
            label="IG"
            variant="outlined"
          />
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
