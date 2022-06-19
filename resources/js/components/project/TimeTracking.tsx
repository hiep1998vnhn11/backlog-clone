import { Box, Card, CardHeader, Divider } from '@mui/material'

const TimeTracking: React.FC<any> = (props) => {
  return (
    <Card {...props}>
      <CardHeader title="Time tracking" />
      <Divider />
      <Box
        sx={{
          px: 4,
          py: 2,
        }}
      >
        <ul>
          <li>Estimated time: </li>
          <li>Spent time: </li>
        </ul>
      </Box>
    </Card>
  )
}
export default TimeTracking
