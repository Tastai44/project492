import {
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Box,
} from "@mui/material";
import { IGroup } from "../../interface/Group";

interface IData {
	groupData: IGroup[];
	imageUrls: string[];
}

export default function Header(props: IData) {

	return (
		<div>
			{props.groupData.map((group) => (
				<ListItem key={group.gId} sx={{ mt: 1 }}>
					<ListItemAvatar>
						<Avatar
							src={props.imageUrls.find((item) => item.includes(group.coverPhoto ?? ''))}
							sx={{ width: "40px", height: "40px" }}
						/>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Box sx={{ fontSize: "16px", ml: -1 }}>
								<b>{group.groupName} </b>
							</Box>
						}
					/>
				</ListItem>
			))}
		</div>
	);
}
