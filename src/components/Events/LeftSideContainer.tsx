import { Box} from '@mui/material'
import Host from './Host'
import InterestedContainer from './InterestedContainer'
// import React from 'react'

export default function LeftSideContainer() {
  return (
    <div>
      <Box sx={{display:"flex", flexDirection:"column"}}>
        <Host />
        <InterestedContainer />
      </Box>
    </div>
  )
}
