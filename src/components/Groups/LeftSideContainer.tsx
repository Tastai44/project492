import { Box } from "@mui/material";
import InterestedContainer from "./InterestedContainer";
import Host from "../Events/Host";
import { IMember } from "../../interface/Group";

interface IData {
  hostId: string;
  members: IMember[];
}

export default function LeftSideContainer({ hostId, members }: IData) {
  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Host hostId={hostId} />
        <InterestedContainer members={members} />
      </Box>
    </div>
  );
}
