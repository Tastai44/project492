import { Box} from '@mui/material'
import InterestedContainer from './InterestedContainer'
import Host from '../Events/Host'

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
