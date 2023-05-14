// import * as React from "react";
import Box from "@mui/material/Box";

import EachGroup from "./EachGroup";
import { Typography, Button, Divider } from "@mui/material";

export default function GroupContainer() {
  return (
    <div>
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
                "&:hover": { backgroundColor: "#e8e8e8", color:"black" },
                borderRadius: "10px",
                backgroundColor: "#A020F0",
                padding: "5px",
                color: "#fff",
              }}
            >
              Create Group
            </Button>
          </div>
        </div>
        <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
        <EachGroup />
      </Box>
    </div>
  );
}
