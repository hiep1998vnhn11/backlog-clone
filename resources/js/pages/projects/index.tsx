import { Box, Container, Grid } from '@mui/material'
import { Budget } from '/@/components/dashboard/budget'
import { LatestOrders } from '/@/components/dashboard/latest-orders'
import { LatestProducts } from '/@/components/dashboard/latest-products'
import { Sales } from '/@/components/dashboard/sales'
import { TasksProgress } from '/@/components/dashboard/tasks-progress'
import { TotalCustomers } from '/@/components/dashboard/total-customers'
import { TotalProfit } from '/@/components/dashboard/total-profit'
import { TrafficByDevice } from '/@/components/dashboard/traffic-by-device'
import TimeTracking from '/@/components/project/TimeTracking'
import IssueTracking from '/@/components/project/IssueTracking'

const ProjectPage = () => {
  const params = useParams()
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      if (!params.key) return
    }
    return () => {
      isMounted.current = false
    }
  }, [params.key])
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalCustomers />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TasksProgress />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalProfit sx={{ height: '100%' }} />
          </Grid> */}
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <IssueTracking sx={{ mb: 2 }} />
            <TimeTracking />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: '100%' }} />
          </Grid>
          {/* <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  )
}
export default ProjectPage
