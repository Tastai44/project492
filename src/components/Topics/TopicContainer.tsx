// import * as React from "react";
import Box from "@mui/material/Box";

import EachTopic from "./EachTopic";
import { Typography, Button, Divider } from "@mui/material";

export default function TopicContainer() {
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
          <Typography variant="h4">Topics</Typography>
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
              Daily
            </Button>
            <Button
              sx={{
                fontSize: "16px",
                "&:hover": { backgroundColor: "#e8e8e8", color:"black" },
                borderRadius: "10px",
                backgroundColor: "#BD68F2",
                padding: "5px",
                color: "#fff",
              }}
            >
              Weekly
            </Button>
            <Button
              sx={{
                fontSize: "16px",
                "&:hover": { backgroundColor: "#e8e8e8", color:"black" },
                borderRadius: "10px",
                backgroundColor: "#8E51E2",
                padding: "5px",
                color: "#fff",
              }}
            >
              Monthly
            </Button>
          </div>
        </div>
        <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
        <EachTopic />
      </Box>
    </div>
  );
}
