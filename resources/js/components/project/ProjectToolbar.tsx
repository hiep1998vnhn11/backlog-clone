import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from '@mui/material'
import { Download as DownloadIcon } from '../../icons/download'
import { Search as SearchIcon } from '../../icons/search'
import { Upload as UploadIcon } from '../../icons/upload'
import useAuth from '/@/context/useAuth'
import { RoleEnum } from '/@/enums/roleEnum'

interface Props {
  toggleOpen: () => void
}
const ProjectToolbar: React.FC<Props> = ({ toggleOpen }) => {
  const { user } = useAuth()
  return (
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Projects
        </Typography>
        <Box sx={{ m: 1 }}>
          {user?.role !== RoleEnum.MEMBER && (
            <Button color="primary" variant="contained" onClick={toggleOpen}>
              Create new Project
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ProjectToolbar
