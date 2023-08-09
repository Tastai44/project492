import { Box } from "@mui/material";
import Members from "./Members";
import Host from "../Events/Host";
import { IMember } from "../../interface/Group";

interface IData {
  gId: string;
  hostId: string;
  members: IMember[];
}
interface IFunction {
  handleRefresh: () => void;
}

export default function LeftSideContainer(props: IData & IFunction) {
  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Host hostId={props.hostId} />
        <Members
          hostId={props.hostId}
          members={props.members}
          gId={props.gId}
          handleRefresh={props.handleRefresh}
        />
      </Box>
    </div>
  );
}
