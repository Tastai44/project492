import { Box, Button, Divider, Typography } from "@mui/material";
import { Item } from "../MContainer/MContainer";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import Tooltip from "@mui/material/Tooltip";

export default function DetailCard() {
  return (
    <div>
      <Box>
        <Item>
          <Typography
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
          </Typography>
          <Divider />
          <Box sx={{textAlign:"left"}}>
            <Typography sx={{m:2, textAlign:"justify"}}>
                Description:
                The FutureTech Summit 2023 is a premier international 
                conference dedicated to exploring the latest advancements 
                and trends in technology and innovation. The event brings 
                together leading experts, entrepreneurs, researchers, and 
                industry professionals from various sectors to share insights, 
                exchange ideas, and foster collaboration.
            </Typography>
          </Box>
        </Item>
      </Box>
    </div>
  );
}
