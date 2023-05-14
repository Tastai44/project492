import { Grid } from '@mui/material'
import React from 'react'
import LeftSide from '../components/LeftSide'
import MContainer from '../components/MContainer/MContainer'
import RightContainer from '../components/RightSide/RightContainer'

export default function Profile() {
  return (
    <div>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={10}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            paddingLeft={5}
            paddingRight={5}
          >
            <Grid item 
            sx={{
                height: "100vh",
                width: "40vh",
                border:"none",
                background:"black"
              }}>
                Left
                
            </Grid>

            <Grid item
            sx={{
                height: "100vh",
                width: "120vh",
                color:"black",
                backgroundColor: "red"
              }}
            >
                Right
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
