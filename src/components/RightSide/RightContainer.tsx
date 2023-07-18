import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Button, Divider, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import UserCard from "./UserCard";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface IFunction {
  handleOpen: () => void;
}

export default function RightContainer({handleOpen} : IFunction) {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        <Item style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              fontSize: "18px",
              fontWeight: "bold",
              padding:10
            }}
          >
            Friend
          </div>
          <div>
            <TextField
              id="outlined-size-small"
              size="small"
              sx={{ m: 1, width: "25vh" }}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              placeholder="Search for friend"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button sx={{ color: "black" }}>Active</Button>
            <Button sx={{ color: "black" }}>General</Button>
          </div>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
          <Box onClick={handleOpen}>
            <UserCard username={"df"} />
          </Box>
        </Item>

        <Item style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              fontSize: "18px",
              fontWeight: "bold",
              padding:10
            }}
          >
            Groups
          </div>
          <div>
            <TextField
              id="outlined-size-small"
              size="small"
              sx={{ m: 1, width: "25vh" }}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              placeholder="Search for friend"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button sx={{ color: "black" }}>Active</Button>
            <Button sx={{ color: "black" }}>General</Button>
          </div>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
          <Box onClick={handleOpen}>
            <UserCard username={"df"} />
          </Box>
        </Item>
      </Stack>
    </Box>
  );
}
