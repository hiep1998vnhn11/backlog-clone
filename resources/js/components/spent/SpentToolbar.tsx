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
} from '@mui/material'
import { Search as SearchIcon } from '../../icons/search'
import { Upload as UploadIcon } from '../../icons/upload'
import { Download as DownloadIcon } from '../../icons/download'
import { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Link } from 'react-router-dom'
import {
  useMemberAndCategory,
  OptionItem,
} from '/@/pages/projects/useMemberAndCategory'

interface Props {
  handleChangeSearchKey: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleCategoryChange: (value: string) => void
  handleAssigneeChange: (value: string) => void
  setStatus: (value: string) => void
  searchKey: string
  projectKey: string
  status: string
}

const issueStatus = [
  'All',
  'Open',
  'In progress',
  'Resolved',
  'Closed',
  'Not closed',
]
const OrderListToolbar: React.FC<Props> = (props) => {
  const params = useParams()
  const [assigneeSelected, setAssigneeSelected] = useState<OptionItem | null>(
    null
  )
  const [categorySelected, setCategorySelected] = useState<OptionItem | null>(
    null
  )
  const { members, categories } = useMemberAndCategory(props.projectKey)
  const {
    handleChangeSearchKey,
    handleCategoryChange,
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
  const handleSelectedCategoryChange = useCallback(
    (_: any, value: OptionItem | null) => {
      handleCategoryChange(value ? value.value + '' : '')
      setCategorySelected(value)
    },
    []
  )
  const handleClick = useCallback(() => {}, [])

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
                  id="assignee"
                  size="small"
                  options={members}
                  value={assigneeSelected}
                  onChange={handleSelectedAssigneeChange}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="Assignee" />
                  )}
                />
              </Grid>
              <Grid item md={2} xs={6}>
                <Autocomplete
                  disablePortal
                  id="category"
                  size="small"
                  options={categories}
                  value={categorySelected}
                  onChange={handleSelectedCategoryChange}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="Category" />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default OrderListToolbar
