import {
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

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
const users = [
  {
    userId: 1,
    userName: "Tastai44",
    firstName: "Tastai",
    lastName: "Khianjai",
  },
  {
    userId: 2,
    userName: "Testing",
    firstName: "Test",
    lastName: "Ing",
  },
];
const groupStatus = [
  { statusId: 1, statusName: "Private" },
  { statusId: 2, statusName: "Public" },
];

export default function AddGroup({ closeEdit }: Ihandle) {
  const theme = useTheme();
  const [member, setMember] = React.useState<string[]>([]);

  const handleAddMember = (event: SelectChangeEvent<typeof member>) => {
    const {
      target: { value },
    } = event;
    setMember(typeof value === "string" ? value.split(",") : value);
  };

  const [statusObj, setStatusObj] = React.useState<string[]>([]);
  const [statusName, setStatusName] = React.useState("");
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatusName(event.target.value as string);
    setStatusObj([event.target.value]);
  };

  return (
    <div style={{ color: "black" }}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5">
          Create a group
        </Typography>
        <Divider sx={{ background: "grey" }} />
        <Box sx={{ mt: 1 }}>
          <TextField
            sx={{ width: "100%" }}
            id="outlined-basic"
            label="Title"
            variant="outlined"
          />

          <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-multiple-checkbox-label">Members</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={member}
                onChange={handleAddMember}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const temp = JSON.parse(value);
                      return (
                        <Chip
                          key={temp.userId}
                          label={`${temp.firstName} ${temp.lastName}`}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {users.map((e) => (
                  <MenuItem
                    key={e.userId}
                    value={JSON.stringify(e)}
                    style={getStyles(e.firstName, member, theme)}
                  >
                    {`${e.firstName} ${e.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-multiple-checkbox-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={statusName}
                label="Project"
                onChange={handleChangeStatus}
              >
                {groupStatus.map((p) => (
                  <MenuItem key={p.statusId} value={JSON.stringify(p)}>
                    {p.statusName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
