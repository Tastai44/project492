import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import ShareIcon from "@mui/icons-material/Share";
import DateRangeIcon from "@mui/icons-material/DateRange";
import GroupsIcon from "@mui/icons-material/Groups";
import { IMember } from "../../interface/Group";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

interface IData {
  coverPhoto: string;
  createAt: string;
  title: string;
  host: string;
  members: IMember[];
}

export default function ProCoverImage(props: IData) {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <div>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia
          sx={{ height: 300 }}
          image={props.coverPhoto}
          title="green iguana"
        />
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-50px",
        }}
      >
        <Card sx={{ width: "95%", backgroundColor: "white", display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  mt: 1,
                  ml: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  fontSize: "20px",
                }}
              >
                {props.title}
              </Box>
              <Box
                sx={{ display: "flex", gap: 0.5, m: 1, alignItems: "center" }}
              >
                <IconButton size="large">
                  <ShareIcon />
                </IconButton>
                <Button
                  sx={{
                    fontSize: "16px",
                    backgroundColor: "#8E51E2",
                    color: "white",
                    "&:hover": {
                      color: "black",
                      backgroundColor: "#E9E8E8",
                    },
                  }}
                  size="small"
                  startIcon={<MessageIcon sx={{ width: "16px" }} />}
                >
                  Chatting
                </Button>
                {userInfo.uid === props.host && (
                  <Button
                    sx={{
                      fontSize: "16px",
                      mr: 1,
                      backgroundColor: "#8E51E2",
                      color: "white",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "#E9E8E8",
                      },
                    }}
                    size="small"
                    startIcon={
                      <BorderColorOutlinedIcon sx={{ width: "16px" }} />
                    }
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </Box>
            <Divider light sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
                <DateRangeIcon />
                <div>Create date: {props.createAt}</div>
              </Box>
              <Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
                <GroupsIcon />
                <div>{props.members.length} members</div>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  );
}
