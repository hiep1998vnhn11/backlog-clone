import { Box, Typography } from '@mui/material'
import { Activity } from '/@/api/activity'
import { formatDateOnlyHour } from '/@/utils/format'

interface Props {
  date: string
  activities: Activity[]
  projectKey: string
}

const ActivityList: React.FC<Props> = ({ date, activities, projectKey }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        variant="h5"
        sx={{
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {date}
      </Typography>

      <Box sx={{ flexGrow: 1, pt: 2 }}>
        {activities.map((activity) => (
          <Box
            key={activity.id}
            sx={{
              pb: 2,
            }}
          >
            <span className="activity-hour">
              {formatDateOnlyHour(activity.created_at)}:{' '}
            </span>
            {Boolean(activity.data) && (
              <Link
                to={`/projects/${projectKey}/${activity.data.link || ''}`}
                className="link"
              >
                {activity.data.label}
              </Link>
            )}
            <br />
            {Boolean(activity.user_id) && (
              <Link
                to={`/projects/${projectKey}/members/${activity.user_id}`}
                className="link"
              >
                {activity.user_name}
              </Link>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ActivityList
