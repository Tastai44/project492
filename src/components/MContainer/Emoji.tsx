import React from "react";
import emojiData from "emoji-datasource-facebook";
import { Box, Paper, Grid, IconButton, Divider } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { themeApp } from "../../utils/Theme";
const styleBoxEmoji = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  color: "black",
  p: 3,
  overflowY: "scroll",
  height: 400,
};
interface IHandle {
  handleClose: () => void;
}

export default function Emoji({ handleClose }: IHandle) {
  const emotionEmojis = emojiData.filter(
    (emoji) => emoji.category === "Smileys & Emotion"
  );
  const [emojiKey, setEmojiKey] = React.useState("");
  const handleGetEmoji = (e: string) => {
    setEmojiKey(e);
  };

  return (
    <Box sx={styleBoxEmoji}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={handleClose}>
          <CancelIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          fontSize: "25px",
          justifyContent: "left",
          pb: 1,
        }}
      >
        Emoji Feeling
      </Box>
      <Divider sx={{ background: "#EAEAEA", marginBottom: 3 }} />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {emotionEmojis.map((emoji) => (
          <Grid item xs={4} key={emoji.unified}>
            <Paper
              sx={{
                textAlign: "center",
                "&:hover": {
                  backgroundColor: themeApp.palette.primary.main,
                },
              }}
              onClick={() => handleGetEmoji(emoji.unified)}
            >
              {String.fromCodePoint(parseInt(emoji.unified, 16))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
