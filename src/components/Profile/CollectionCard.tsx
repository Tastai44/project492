import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Luffy from "../../../public/pictures/Luffy.webp";

export default function CollectionCard() {
  return (
    <Card sx={{ width: 210, background: 'linear-gradient(to bottom, #000000, #CECCCC8A)', margin:"10px"}}>
      <CardMedia component="img" image={Luffy} alt="Paella dish" />
    </Card>
  );
}
