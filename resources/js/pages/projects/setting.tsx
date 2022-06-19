import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
} from '@mui/material'
import Dialog from '/@/components/Dialog'
import {
  createCategory,
  Category,
  getCategories,
  deleteCategory,
} from '/@/api/category'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { formatDateOnly } from '/@/utils/format'
import useApp from '/@/context/useApp'
import { styled } from '@mui/material/styles'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  )
}

const Settings = () => {
  const { createConfirmModal, toastSuccess, toastError } = useApp()
  const dialogState = useRef({
    type: 'category',
    title: 'New Category',
  })
  const params = useParams()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState(false)
  const toggleOpen = useCallback(() => setOpen((value) => !value), [])
  const [tab, setTab] = useState(2)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const isMounted = useRef(false)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      handleChangeTab(undefined, tab)
    }

    return () => {
      isMounted.current = false
    }
  }, [])

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value)
    },
    []
  )
  const handleDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(event.target.value)
    },
    []
  )
  const fetchCategory = useCallback(async () => {
    try {
      setLoadingCategory(true)
      const response = await getCategories(params.key!)
      if (isMounted.current) setCategories(response)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingCategory(false)
    }
  }, [])
  const handleChangeTab = useCallback(
    (_: any, newValue: number) => {
      if (newValue === 2 && !categories.length) fetchCategory()
      setTab(newValue)
    },
    [categories]
  )

  const handleCreateCategory = useCallback(async () => {
    try {
      setLoading(true)
      await createCategory({
        name,
        description,
        project_key: params.key!,
      })
      setName('')
      setDescription('')
      toggleOpen()
      fetchCategory()
    } catch (error: any) {
      setNameError(error.data.errors.name?.[0])
    } finally {
      setLoading(false)
    }
  }, [name, description, params.key])
  const onCategoryDelete = useCallback((id: number) => {
    createConfirmModal({
      title: 'Are you sure you want to delete this category?',
      content: 'You can not undo this action.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmDestructive: true,
      onConfirm: async () => {
        try {
          await deleteCategory(id)
          toastSuccess('Category deleted successfully.')
          setCategories((value) => value.filter((item) => item.id !== id))
        } catch (error) {
          console.log(error)
          toastError('Failed to delete category.')
        }
      },
    })
  }, [])
  return (
    <Box component="main" sx={{ p: 2 }}>
      <Typography variant="h4">Project settings</Typography>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Member" {...a11yProps(1)} />
            <Tab label="Categories" {...a11yProps(2)} />
          </Tabs>
          <div>
            <Button variant="contained" size="small" onClick={toggleOpen}>
              Add Category
            </Button>
          </div>
        </Box>
        <TabPanel value={tab} index={0}>
          <Button>Add Category</Button>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingCategory ? (
                <tr>
                  <td colSpan={4}>Loading</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <StyledTableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{formatDateOnly(category.created_at)}</TableCell>
                    <TableCell align="right">
                      <IconButton color="success">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onCategoryDelete(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabPanel>
      </Box>

      <Dialog
        open={open}
        onClose={toggleOpen}
        title={dialogState.current.title}
        cancelText="Cancel"
        confirmText="Save"
        onConfirm={handleCreateCategory}
        loading={loading}
      >
        <Box sx={{ width: '600px' }}>
          <TextField
            fullWidth
            required
            label="Category name"
            margin="normal"
            name="name"
            onChange={handleNameChange}
            value={name}
            size="small"
            variant="outlined"
            error={!!nameError}
            helperText={nameError}
          />
          <Typography variant="body2" sx={{ color: '#666' }}>
            Name of category; generally it set to issue.
            <br />
            category can be defined in each project.
            <br />
            e.g. "Subsystem A", "Research", "Design", and so on.
          </Typography>
          <TextField
            fullWidth
            label="Category description"
            margin="normal"
            name="description"
            onChange={handleDescriptionChange}
            value={description}
            size="small"
            variant="outlined"
            multiline
            rows={4}
          />
        </Box>
      </Dialog>
    </Box>
  )
}
export default Settings
