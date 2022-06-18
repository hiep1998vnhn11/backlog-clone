import styled from '@emotion/styled'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Theme,
  Button,
  TextField,
  InputAdornment,
  SvgIcon,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { Bell as BellIcon } from '../icons/bell'
import { UserCircle as UserCircleIcon } from '../icons/user-circle'
import { useEventListener } from '/@/hooks/common'
import useAuth from '../context/useAuth'
import { Cog as CogIcon } from '../icons/cog'
import { Search as SearchIcon } from '../icons/search'

const DashboardNavbarRoot = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}))

type Props = {
  toggleSidebar: () => void
  isSidebarOpen: boolean
  hideSidebar: boolean
} & any
export const DashboardNavbar: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [searchProject, setSearchProject] = useState('')
  const handleChangeSearchProject = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchProject(e.target.value)
    },
    []
  )
  //dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [dropdown, setDropdown] = useState(false)
  const toggleDropdown = useCallback(() => setDropdown((value) => !value), [])
  //project dropdown
  const projectDropdownRef = useRef<HTMLDivElement | null>(null)
  const [projectDropdown, setProjectDropdown] = useState(false)
  const toggleProjectDropdown = useCallback(
    () => setProjectDropdown((value) => !value),
    []
  )
  const { toggleSidebar, isSidebarOpen, hideSidebar, ...other } = props
  useEventListener('click', (event) => {
    const target = event.target as HTMLElement
    ;(() => {
      if (!dropdown || !dropdownRef.current) return
      if (dropdownRef.current.contains(target) || dropdownRef.current == target)
        return
      setDropdown(false)
    })()
    ;(() => {
      if (!projectDropdown || !projectDropdownRef.current) return
      if (
        projectDropdownRef.current.contains(target) ||
        projectDropdownRef.current == target
      )
        return
      setProjectDropdown(false)
    })()
  })

  return (
    <DashboardNavbarRoot
      sx={{
        left: {
          lg: isSidebarOpen && !hideSidebar ? 240 : 0,
        },
        width: {
          lg: isSidebarOpen && !hideSidebar ? 'calc(100% - 240px)' : '100%',
        },
      }}
      {...other}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          left: 0,
          px: 2,
        }}
      >
        {!hideSidebar && (
          <Tooltip title="Toggle Sidebar">
            <IconButton onClick={toggleSidebar}>
              <MenuIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Button LinkComponent={Link} to="/">
          Dashboard
        </Button>
        <div ref={projectDropdownRef} className="dropdown">
          <Button onClick={toggleProjectDropdown}>Project</Button>
          {projectDropdown && (
            <div className="dropdown-menu left project-search">
              <div className="project-search-title">Your projects</div>
              <TextField
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                value={searchProject}
                onChange={handleChangeSearchProject}
                placeholder="Search project"
                variant="outlined"
              />
              <ul className="project-list">
                {[...Array(100)].map((_, i) => (
                  <li key={i} className="project-list-item">
                    BackLog
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button>Projects</Button>
        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Notifications">
          <IconButton sx={{ ml: 1 }}>
            <Badge badgeContent={4} color="primary" variant="dot">
              <BellIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        <div ref={dropdownRef} className="dropdown">
          <div
            className="header-avatar cursor-pointer"
            onClick={toggleDropdown}
          >
            <Avatar
              sx={{
                height: 40,
                width: 40,
                ml: 2,
              }}
              src={user!.avatar || ''}
            >
              <UserCircleIcon fontSize="small" />
            </Avatar>
          </div>
          {dropdown && (
            <div className="dropdown-menu">
              <Button
                fullWidth
                onClick={() => navigate('/account')}
                variant="contained"
                color="info"
                startIcon={<CogIcon />}
              >
                Tài khoản của tôi
              </Button>
              <div className="divider" />
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={logout}
                startIcon={<LogoutIcon />}
              >
                Đăng xuất
              </Button>
            </div>
          )}
        </div>
      </Toolbar>
    </DashboardNavbarRoot>
  )
}
