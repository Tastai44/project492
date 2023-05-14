import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Stack,
  styled,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import React from "react";
import Luffy from "../../../public/pictures/Luffy.webp";

export default function ProCoverImage() {
  return (
    <div>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia sx={{ height: 300 }} image={Luffy} title="green iguana" />
      </Card>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "-40px",
          marginRight: "10px",
        }}
      >
        <Button
          sx={{
            width: "200px",
            backgroundColor: "white",
            color: "black",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "&:hover": {
              color: "white",
              backgroundColor: "black",
            },
          }}
        >
          <AddAPhotoIcon />
          <div>Add cover photo</div>
        </Button>
      </div>
    </div>
  );
}
