import * as React from "react";
import Box from "@mui/material/Box";
import { Divider, Stack, Typography } from "@mui/material";
import { User } from "../../interface/User";
import { Item } from "../../App";

import { collection, query, getDocs, where } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";

interface IData {
  reFresh: number;
}

export default function AboutMe({reFresh} : IData) {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", userInfo.uid)
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) =>
            ({
              uid: doc.id,
              ...doc.data(),
            } as User)
        );
        setInFoUser(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo.uid, reFresh]);

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
