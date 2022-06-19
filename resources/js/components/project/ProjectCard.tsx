import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { Clock as ClockIcon } from '../../icons/clock'
import { Cog as CogIcon } from '../../icons/cog'
import { Project } from '/@/api/models/projectModel'
import { getRelativeTime } from '/@/utils/format'
import { Link } from 'react-router-dom'

interface Props {
  project: Project
}
const ProjectCard: React.FC<Props> = ({ project, ...rest }) => (
  <Link to={'/projects/' + project.key} className="link">
    <Card className="project-card" {...rest}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3,
          }}
        >
          <div
            style={{
              border: 'solid 1px rgba(0,0,0,0.1)',
              borderRadius: '50%',
              padding: '10px',
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CogIcon />
          </div>
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {project.name}
        </Typography>
        <Typography align="center" color="textPrimary" variant="body1">
          {project.key}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Grid
            item
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <ClockIcon color="action" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              Updated {getRelativeTime(project.updated_at)}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Button color="info" variant="contained">
              Issues
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  </Link>
)

export default ProjectCard
