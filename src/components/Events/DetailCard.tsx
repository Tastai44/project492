import { Box, Button, Divider } from "@mui/material";
import { Item } from "../MContainer/MContainer";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";

import Tooltip from "@mui/material/Tooltip";

interface IData {
  details: string;
}

export default function DetailCard({details} : IData) {

  return (
    <div>
      <Box>
        <Item>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "20px", color:"black" }}>Details</div>
            <Tooltip title="Report" sx={{ color: "black" }}>
              <Button startIcon={<FlagCircleIcon />}>Report</Button>
            </Tooltip>
          </Box>
          <Divider />
          <Box sx={{textAlign:"left"}}>
            <Box sx={{m:2, textAlign:"justify"}}>
              {details}
            </Box>
          </Box>
        </Item>
      </Box>
    </div>
  );
}