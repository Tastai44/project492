import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface IData {
    userId: string;
}

export default function TabLink(props: IData) {
    return (
        <Box sx={{ borderBottom: 2, borderColor: 'divider', mb: 2, display: { xs: "block", lg: "none" } }}>
            <Box sx={{ display: "flex", fontSize: "18px", gap: 5, ml: 1, color: "black" }}>
                <NavLink to={`/profileBlog/${props.userId}`}
                    style={({ isActive, isPending }) => {
                        return {
                            color: !isActive ? "black" : "#8E51E2",
                            fontWeight: isPending ? "bold" : "",
                            borderBlockEnd: isActive ? "2px solid #8E51E2" : "",
                        };
                    }}
                >
                    Blog
                </NavLink>
                <NavLink to={`/aboutMe/${props.userId}`}
                    style={({ isActive, isPending }) => {
                        return {
                            color: !isActive ? "black" : "#8E51E2",
                            fontWeight: isPending ? "bold" : "",
                            borderBlockEnd: isActive ? "2px solid #8E51E2" : "",
                        };
                    }}
                >
                    AM
                </NavLink>
                <NavLink to={`/friends/${props.userId}`}
                    style={({ isActive, isPending }) => {
                        return {
                            color: !isActive ? "black" : "#8E51E2",
                            fontWeight: isPending ? "bold" : "",
                            borderBlockEnd: isActive ? "2px solid #8E51E2" : "",
                        };
                    }}
                >
                    Friends
                </NavLink>
                <NavLink to={`/collections/${props.userId}`}
                    style={({ isActive, isPending }) => {
                        return {
                            color: !isActive ? "black" : "#8E51E2",
                            fontWeight: isPending ? "bold" : "",
                            borderBlockEnd: isActive ? "2px solid #8E51E2" : "",
                        };
                    }}
                >
                    Collections
                </NavLink>
            </Box>
        </Box>
    );
}
