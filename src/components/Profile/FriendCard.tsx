import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Luffy from "../../../public/pictures/Luffy.webp";
import { Button } from "@mui/material";

export default function FriendCard() {
  return (
    <Card sx={{ width: 210, background: 'linear-gradient(to bottom, #000000, #CECCCC8A)', margin:"10px"}}>
      <CardMedia component="img" image={Luffy} alt="Paella dish" />
      <CardContent>
        <Typography variant="body2" color="white" sx={{fontSize:"20px"}}>
          Tastai Khianjai
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{display:"flex", justifyContent:"center", gap:1}}>
        <Button sx={{color:"white", borderRadius:"5px", backgroundColor:"#920EFA"}}>View</Button>
        <Button sx={{color:"white", borderRadius:"5px", backgroundColor:"red"}}>UnFriend</Button>
      </CardActions>
    </Card>
  );
}
