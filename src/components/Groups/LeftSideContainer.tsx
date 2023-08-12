import { Box } from "@mui/material";
import Members from "./Members";
import Host from "../Events/Host";
import { IMember } from "../../interface/Group";

interface IData {
	gId: string;
	hostId: string;
	members: IMember[];
}

export default function LeftSideContainer(props: IData) {
	return (
		<div>
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				<Host hostId={props.hostId} />
				<Members
					hostId={props.hostId}
					members={props.members}
					gId={props.gId}
				/>
			</Box>
		</div>
	);
}
