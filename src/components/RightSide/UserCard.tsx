// import { Avatar } from '@mui/material'
// import React from 'react'
// import Luffy from "../../../public/pictures/Luffy.webp";

// export default function UserCard() {
//   return (
//     <div style={{display:"flex", gap:10, alignItems:"center"}}>
//         <Avatar alt="Remy Sharp" src={Luffy} />
//         <p>Tastai Khianjai</p>
//     </div>
//   )
// }


import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Luffy from "../../../public/pictures/Luffy.webp";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

export default function BadgeAvatars() {
  return (
    <Stack direction="row" spacing={2} style={{display:"flex", alignItems:"center", marginBottom:"10px"}}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar alt="Remy Sharp" src={Luffy} /> 
      </StyledBadge>
      <p style={{fontSize:"16px"}}>Tastai Khianai</p>
    </Stack>
  );
}