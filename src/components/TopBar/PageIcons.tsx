import { Box, Tooltip } from "@mui/material";
import { DateRangeIcon } from "@mui/x-date-pickers";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import TagIcon from "@mui/icons-material/Tag";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import FlagIcon from "@mui/icons-material/Flag";

interface IData {
    userId?: string;
    IsAdmin: boolean;
}

export default function PageIcons(props: IData) {
    return (
        <Box sx={{ display: { xs: "none", md: "flex", gap: 30 } }}>
            <NavLink
                to="/home"
                style={({ isActive, isPending }) => {
                    return {
                        fontWeight: isPending ? "bold" : "",
                        color: isActive ? "white" : "white",
                        borderBlockEnd: isActive ? "2px solid white" : "",
                    };
                }}
            >
                <Tooltip title="Home">
                    <HomeIcon
                        sx={{
                            fontSize: "30px",
                            "&:hover": {
                                backgroundColor: "#e8e8e8",
                                color: "#8E51E2",
                            },
                            borderRadius: "10px",
                            padding: "10px",
                        }}
                    />
                </Tooltip>
            </NavLink>
            <NavLink
                to={`/friends/${props.userId}`}
                style={({ isActive, isPending }) => {
                    return {
                        fontWeight: isPending ? "bold" : "",
                        color: isActive ? "white" : "white",
                        borderBlockEnd: isActive ? "2px solid white" : "",
                    };
                }}
            >
                <Tooltip title="Friends">
                    <PeopleAltIcon
                        sx={{
                            fontSize: "30px",
                            "&:hover": {
                                backgroundColor: "#e8e8e8",
                                color: "#8E51E2",
                            },
                            borderRadius: "10px",
                            padding: "10px",
                        }}
                    />
                </Tooltip>
            </NavLink>
            <NavLink
                to={"/members"}
                style={({ isActive, isPending }) => {
                    return {
                        fontWeight: isPending ? "bold" : "",
                        color: isActive ? "white" : "white",
                        borderBlockEnd: isActive ? "2px solid white" : "",
                    };
                }}
            >
                <Tooltip title="Members">
                    <GroupsIcon
                        sx={{
                            fontSize: "30px",
                            "&:hover": {
                                backgroundColor: "#e8e8e8",
                                color: "#8E51E2",
                            },
                            borderRadius: "10px",
                            padding: "10px",
                        }}
                    />
                </Tooltip>
            </NavLink>
            <NavLink
                to={"/events"}
                style={({ isActive, isPending }) => {
                    return {
                        fontWeight: isPending ? "bold" : "",
                        color: isActive ? "white" : "white",
                        borderBlockEnd: isActive ? "2px solid white" : "",
                    };
                }}
            >
                <Tooltip title="Events">
                    <DateRangeIcon
                        sx={{
                            fontSize: "30px",
                            "&:hover": {
                                backgroundColor: "#e8e8e8",
                                color: "#8E51E2",
                            },
                            borderRadius: "10px",
                            padding: "10px",
                        }}
                    />
                </Tooltip>
            </NavLink>
            <NavLink
                to={"/topics"}
                style={({ isActive, isPending }) => {
                    return {
                        fontWeight: isPending ? "bold" : "",
                        color: isActive ? "white" : "white",
                        borderBlockEnd: isActive ? "2px solid white" : "",
                    };
                }}
            >
                <Tooltip title="Topics">
                    <TagIcon
                        sx={{
                            fontSize: "30px",
                            "&:hover": {
                                backgroundColor: "#e8e8e8",
                                color: "#8E51E2",
                            },
                            borderRadius: "10px",
                            padding: "10px",
                        }}
                    />
                </Tooltip>
            </NavLink>
            <NavLink
                to="/groups"
                style={({ isActive, isPending }) => {
                    return {
                        fontWeight: isPending ? "bold" : "",
                        color: isActive ? "white" : "white",
                        borderBlockEnd: isActive ? "2px solid white" : "",
                    };
                }}
            >
                <Tooltip title="Groups">
                    <Diversity3Icon
                        sx={{
                            fontSize: "30px",
                            "&:hover": {
                                backgroundColor: "#e8e8e8",
                                color: "#8E51E2",
                            },
                            borderRadius: "10px",
                            padding: "10px",
                        }}
                    />
                </Tooltip>
            </NavLink>
            {props.IsAdmin && (
                <NavLink
                    to="/report"
                    style={({ isActive, isPending }) => {
                        return {
                            fontWeight: isPending ? "bold" : "",
                            color: isActive ? "white" : "white",
                            borderBlockEnd: isActive ? "2px solid white" : "",
                        };
                    }}
                >
                    <Tooltip title="Report">
                        <FlagIcon
                            sx={{
                                fontSize: "30px",
                                "&:hover": {
                                    backgroundColor: "#e8e8e8",
                                    color: "#8E51E2",
                                },
                                borderRadius: "10px",
                                padding: "10px",
                            }}
                        />
                    </Tooltip>
                </NavLink>
            )}
        </Box>
    );
}
