// import * as React from "react";
import Box from "@mui/material/Box";

import EachGroup from "./EachGroup";
import { Typography, Button, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";
import { IGroup } from "../../interface/Group";

interface IFunction {
  openAddGroup: () => void;
}
interface IData {
  groupData: IGroup[];
}

export default function GroupContainer({
  openAddGroup,
  groupData,
}: IFunction & IData) {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper", color: "black" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Typography variant="h4">Groups</Typography>
        <div
          style={{
            display: "flex",
            gap: "5px",
          }}
        >
          <Button
            sx={{
              fontSize: "16px",
              "&:hover": { backgroundColor: "#e8e8e8", color: "black" },
              borderRadius: "10px",
              backgroundColor: "#A020F0",
              padding: "5px",
              color: "#fff",
            }}
            onClick={openAddGroup}
          >
            Create Group
          </Button>
        </div>
      </div>
      <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
      {groupData
        .filter(
          (item) =>
            item.status === "Public" ||
            (item.hostId === userInfo.uid) ||
            item.members.some((member) => member.uid === userInfo.uid)
        )
        .map((g) => (
          <NavLink key={g.gId} to={`/groupDetail/${g.gId}`}>
            <EachGroup title={g.groupName} />
          </NavLink>
        ))}
    </Box>
  );
}
