import { Box } from "@mui/material";
import Members from "./Members";
import Host from "../Events/Host";

interface IData {
	gId: string;
	hostId: string;
	members: string[];
	imageUrls: string[];
}

export default function LeftSideContainer(props: IData) {
	return (
		<div>
			<Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column" }}>
				<Host
					hostId={props.hostId}
					imageUrls={props.imageUrls}
				/>
				<Members
					hostId={props.hostId}
					members={props.members}
					gId={props.gId}
				/>
			</Box>
		</div>
	);
}
