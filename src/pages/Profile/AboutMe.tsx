import Box from "@mui/material/Box";
import { Divider, Stack, Typography } from "@mui/material";
import { User } from "../../interface/User";
import { Item } from "../../App";

interface IData {
  inFoUser: User[];
}

export default function AboutMe({ inFoUser }: IData) {

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          sx={{
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Item
            sx={{
              padding: "50px",
              fontSize: "30px",
              width: "50%",
              alignSelf: "center",
            }}
          >
            About me
          </Item>
          {inFoUser.map((m) => (
            <Item
              key={m.uid}
              sx={{
                padding: "50px",
                width: "50%",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Typography>
                <b>Faculty:</b> {m.faculty}
              </Typography>
              <Typography>
                <b>Year:</b> {m.year}
              </Typography>
              <Typography>
                <b>Status:</b> {m.status}
              </Typography>
              <Typography>
                <b>IG:</b> {m.instagram}
              </Typography>
            </Item>
          ))}
        </Stack>
      </Box>
    </div>
  );
}
