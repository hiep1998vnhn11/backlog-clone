import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material'
import { ProjectMember } from '/@/api/models/projectModel'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

interface Props {
  members: ProjectMember[]
  projectKey: string
  [key: string]: any
}
const ProjectMemberPage: React.FC<Props> = ({
  members,
  projectKey,
  ...props
}) => {
  return (
    <Card {...props}>
      <CardHeader title="Members" />
      <Divider />
      <CardContent sx={{ px: 4 }}>
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              <Link
                to={`/projects/${projectKey}/members/${member.id}`}
                className="link"
              >
                {member.name}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>

      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1,
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
          LinkComponent={Link}
          to={`/projects/${projectKey}/setting?_t=member`}
        >
          All members
        </Button>
      </Box>
    </Card>
  )
}

export default ProjectMemberPage
