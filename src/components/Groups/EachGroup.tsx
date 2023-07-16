import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";

interface IData {
  title: string;
}
export default function EachGroup({title} : IData) {
  return (
          <List sx={{color:"black"}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                <ListItemText primary={`${title}`} />
                {/* <BorderColorIcon />
                <DeleteIcon /> */}
              </ListItemButton>
            </ListItem>
          </List>
  )
}
