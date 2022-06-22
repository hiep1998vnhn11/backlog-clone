import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Icon,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import Page404 from '../../404'
import { Issue, getIssue, getIssueSpents } from '/@/api/issue'
import { IssueStatus, IssuePercentComplete } from './format'
import { getRelativeTime, formatDateOnly } from '/@/utils/format'
import { SpentTime } from '/@/api/spent'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const IssuePage: React.FC = () => {
  const params = useParams()
  const isMounted = useRef(false)
  const [loading, setLoading] = useState(true)
  const [loadingTab, setLoadingTab] = useState(true)
  const [issue, setIssue] = useState<Issue | null>(null)
  const [tab, setTab] = useState(0)
  const [spents, setSpents] = useState<SpentTime[]>([])
  const fetchSpents = useCallback(async () => {
    try {
      setLoadingTab(true)
      const response = await getIssueSpents(+params.id!)
      if (isMounted.current) setSpents(response)
    } catch (error) {
      setSpents([])
    } finally {
      setLoadingTab(false)
    }
  }, [])
  const handleChangeTab = useCallback(
    (_: any, newValue: number) => {
      tab !== newValue && setTab(newValue)
      if (newValue === 1) return fetchSpents()
    },
    [tab]
  )
  const fetchIssue = useCallback(async () => {
    try {
      const response = await getIssue(params.id!, params.key!)
      if (isMounted.current) setIssue(response)
    } catch (error: any) {
    } finally {
      setTimeout(() => (isMounted.current ? setLoading(false) : null), 250)
    }
  }, [])
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      fetchIssue()
      handleChangeTab(undefined, tab)
    }
    return () => {
      isMounted.current = false
    }
  }, [params])
  if (loading)
    return (
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        <div className="flex justify-between mb-2">
          <Skeleton variant="rectangular" height={30} />
          <Skeleton variant="rectangular" height={30} />
        </div>
        <Skeleton variant="rectangular" height={600} />
      </Box>
    )
  if (issue === null) return <Page404 />
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
      }}
    >
      <div className="flex justify-between">
        <Typography sx={{ mb: 1 }} variant="h5">
          {issue.tracker}#{issue.id}
          {IssueStatus(issue.status)}
        </Typography>
        <div>
          <Button
            LinkComponent={Link}
            to={`/projects/${params.key}/issues/${params.id}/edit`}
            variant="contained"
            size="small"
          >
            Edit
          </Button>
          <Button
            LinkComponent={Link}
            to={`/projects/${params.key}/issues/${params.id}/spent`}
            variant="outlined"
            size="small"
            color="success"
            sx={{ mx: 2 }}
          >
            Log time
          </Button>
          <Button size="small">Copy link</Button>
        </div>
      </div>
      <Typography sx={{ pl: 4 }} variant="h4">
        {issue.subject}
      </Typography>
      <Typography sx={{ pl: 4, pb: 4, pt: 2 }} variant="body1">
        Added by{' '}
        <Link
          className="link"
          to={`/projects/${params.key}/members/${issue.user_id}`}
        >
          {issue.user?.name}
        </Link>{' '}
        about {getRelativeTime(issue.created_at)}. Updated about{' '}
        {getRelativeTime(issue.updated_at)}.
      </Typography>

      <Grid container>
        <Grid item xs={6} md={2}>
          Category:
          <br />
          Priority:
          <br />
          Assignee:
          <br />
          Level:
        </Grid>
        <Grid item xs={6} md={2}>
          {issue.category?.name || '-'}
          <br />
          {issue.priority}
          <br />
          <Link
            className="link"
            to={`/projects/${params.key}/members/${issue.user_id}`}
          >
            {issue.assignee?.name || '-'}
          </Link>
          <br />
          {issue.level}
        </Grid>

        <Grid item xs={6} md={2}>
          Start Date:
          <br />
          Due date:
          <br />
          % Done:
          <br />
          Estimated time:
          <br />
          Spent time:
        </Grid>
        <Grid item xs={6} md={2}>
          {formatDateOnly(issue.start_date)}
          <br />
          {formatDateOnly(issue.due_date)}
          <br />
          {IssuePercentComplete(issue.percent_complete)}
          {issue.estimate_time || 0} h
          <br />
          {issue.spent_time || 0} h
        </Grid>
      </Grid>
      <hr className="mt-2" />
      <h5 className="mt-2">Description:</h5>
      <Typography sx={{ pt: 2 }} variant="body1">
        {issue.description}
      </Typography>
      <div>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab label="Comments" {...a11yProps(0)} />
            <Tab label="Spent time" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          Comments
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {spents.map((spent) => (
            <div className="spent">
              <h4>
                Added by{' '}
                <Link
                  to={`/projects/${params.key!}/members/${spent.user_id}`}
                  className="link"
                >
                  {spent.user_name}
                </Link>{' '}
                about {getRelativeTime(spent.created_at)}
              </h4>
              <div className="detail">
                <b>Spent time:</b> {spent.hours} h
              </div>
            </div>
          ))}
        </TabPanel>
      </div>
    </Box>
  )
}
export default IssuePage
