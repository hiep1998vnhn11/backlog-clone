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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { Bell as BellIcon } from '../icons/bell'
import { UserCircle as UserCircleIcon } from '../icons/user-circle'
import { useRef, useState, useCallback } from 'react'
import { useEventListener } from '/@/hooks/common'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Cog as CogIcon } from '../icons/cog'

const DashboardNavbarRoot = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}))

type Props = {
  toggleSidebar: () => void
  isSidebarOpen: boolean
} & any
export const DashboardNavbar: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [dropdown, setDropdown] = useState(false)
  const toggleDropdown = useCallback(() => setDropdown((value) => !value), [])
  const { toggleSidebar, isSidebarOpen, ...other } = props
  useEventListener('click', (event) => {
    if (!dropdown || !dropdownRef.current) return
    const target = event.target as HTMLElement
    if (dropdownRef.current.contains(target) || dropdownRef.current == target)
      return
    setDropdown(false)
  })

  return (
    <DashboardNavbarRoot
      sx={{
        left: {
          lg: isSidebarOpen ? 240 : 0,
        },
        width: {
          lg: isSidebarOpen ? 'calc(100% - 240px)' : '100%',
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
        <Tooltip title="Đóng / mở Sidebar">
          <IconButton onClick={toggleSidebar}>
            <MenuIcon fontSize="small" />
          </IconButton>
        </Tooltip>
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
