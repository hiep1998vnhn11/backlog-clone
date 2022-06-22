import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Grid,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import { Search as SearchIcon } from '../../icons/search'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useMemberAndCategory,
  OptionItem,
} from '/@/pages/projects/useMemberAndCategory'

interface Props {
  handleChangeSearchKey: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleAssigneeChange: (value: string) => void
  setStatus: (value: string) => void
  searchKey: string
  projectKey: string
  status: string
  level: string
  setLevel: (value: string) => void
}

const issueStatus = ['All', 'Development', 'Check']
const OrderListToolbar: React.FC<Props> = (props) => {
  const params = useParams()
  const [assigneeSelected, setAssigneeSelected] = useState<OptionItem | null>(
    null
  )
  const { members } = useMemberAndCategory(props.projectKey)
  const {
    handleChangeSearchKey,
    setLevel,
    level,
    handleAssigneeChange,
    searchKey,
    status,
    setStatus,
  } = props

  const handleSelectedAssigneeChange = useCallback(
    (_: any, value: OptionItem | null) => {
      handleAssigneeChange(value ? value.value + '' : '')
      setAssigneeSelected(value)
    },
    []
  )

  const handleLevelChange = useCallback((event: SelectChangeEvent<string>) => {
    setLevel(event.target.value)
  }, [])

  return (
    <Box {...props}>
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
          Spent time
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button
            LinkComponent={Link}
            color="primary"
            variant="contained"
            to={`/projects/${params.key}/add/spent`}
          >
            New spent time
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <div className="flex items-center mb-2 gap-2">
              Status:
              {issueStatus.map((item) => (
                <Chip
                  className="ml-2"
                  label={item}
                  key={item}
                  variant="outlined"
                  onClick={() => setStatus(item)}
                  color={status === item ? 'primary' : 'default'}
                />
              ))}
            </div>
            <Grid container spacing={1}>
              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  fullWidth
                  value={searchKey}
                  onChange={handleChangeSearchKey}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search key"
                  variant="outlined"
                />
              </Grid>
              <Grid item md={2} xs={6}>
                <Autocomplete
                  disablePortal
                  id="user"
                  size="small"
                  options={members}
                  value={assigneeSelected}
                  onChange={handleSelectedAssigneeChange}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="User" />
                  )}
                />
              </Grid>
              <Grid item md={2} xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="date-type">Level</InputLabel>
                  <Select
                    labelId="date-type"
                    id="date-type"
                    value={level}
                    label="Start Date"
                    onChange={handleLevelChange}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                    <MenuItem value="Extremely hard">Extremely hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default OrderListToolbar
