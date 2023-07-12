import * as React from "react";
import { Box, Button, Card, CardMedia } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Luffy from "../../../public/pictures/Luffy.webp";

export default function ProCoverImage() {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      try {
        const selectedFiles = Array.from(files);
        const readerPromises = selectedFiles.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        const base64Images = await Promise.all(readerPromises);
        setPreviewImages(base64Images);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia sx={{ height: 300 }} image={Luffy} title="green iguana" />
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: "-4%",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Button
          onClick={handleUploadClick}
          sx={{
            backgroundColor: "white",
            color: "black",
            "&:hover": {
              color: "white",
              backgroundColor: "black",
            },
          }}
          variant="outlined"
          startIcon={<AddAPhotoIcon />}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            hidden
          />
          Add cover photo
        </Button>
      </Box>
    </div>
  );
}
