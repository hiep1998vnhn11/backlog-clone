import { Box, Container, Grid, Icon, Typography } from '@mui/material'
import { AccountProfile } from '../../components/account/account-profile'
import { AccountProfileDetails } from '../../components/account/account-profile-details'
import AccountPassword from '../../components/account/account-password'
import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowBackIos, ArrowBack } from '@mui/icons-material'

const ShowAccount = () => {
  const params = useParams()
  useEffect(() => {
    console.log(params.id)
  }, [])
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Typography sx={{ mb: 3 }} variant="h4">
          Gantt chart
        </Typography>
        <Grid container spacing={3}>
          Comming soon
        </Grid>
      </Container>
    </Box>
  )
}
export default ShowAccount
