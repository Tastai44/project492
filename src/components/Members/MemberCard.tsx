import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

interface IData {
  username: string;
  profilePhoto: string;
  uId: string;
}

export default function MemberCard(props : IData) {
  return (
    <Card sx={{ width: 250 }}>
      <CardActions disableSpacing sx={{display:"flex", justifyContent:"center", gap:1 ,background:"white"}}>
        <Button sx={{fontSize:"14px", color:"white", borderRadius:"5px", backgroundColor:"#A005FF", '&:hover':{color:"black", backgroundColor:"#F1F1F1"}}}>Add Friend</Button>
        <Button sx={{fontSize:"14px", color:"white", borderRadius:"5px", backgroundColor:"grey", '&:hover':{color:"black", backgroundColor:"#F1F1F1"}}}>UnKnow</Button>
      </CardActions>
      {props.profilePhoto ? (
        <CardMedia component="img" height="194" image={props.profilePhoto} alt="Paella dish" />
      ) : (
        <Box sx={{width:"100%", backgroundColor:"primary.contrastText"}}>
          <AccountBoxIcon sx={{fontSize:"200px", color:"white"}}/>
        </Box>
        
      )}
      
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{fontSize:"20px"}}>
          {props.username}
        </Typography>
      </CardContent>
    </Card>
  );
}
