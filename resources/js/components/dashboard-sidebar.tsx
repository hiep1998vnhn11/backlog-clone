import { useEffect, useMemo } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
  Theme,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { ChartBar as ChartBarIcon } from '../icons/chart-bar'
import { Cog as CogIcon } from '../icons/cog'
import { Lock as LockIcon } from '../icons/lock'
import { Selector as SelectorIcon } from '../icons/selector'
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag'
import { User as UserIcon } from '../icons/user'
import { UserAdd as UserAddIcon } from '../icons/user-add'
import { Users as UsersIcon } from '../icons/users'
import { XCircle as XCircleIcon } from '../icons/x-circle'
import { Logo } from './logo'
import { NavItem } from './nav-item'
import useAuth from '../context/useAuth'

interface Props {
  open: boolean
  onClose: () => void
}
export const DashboardSidebar: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { open, onClose } = props
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false,
  })
  const items = useMemo(() => {
    if (!user) return []
    return [
      {
        href: '/',
        icon: <ChartBarIcon fontSize="small" />,
        title: 'Dashboard',
      },
      {
        href: '/orders',
        icon: <ShoppingBagIcon fontSize="small" />,
        title: 'Danh sách đơn hàng',
      },
      {
        href: '/orders/drafts',
        icon: <ShoppingBagIcon fontSize="small" />,
        title: 'Đơn lưu kho',
      },
      {
        href: '/orders/shippings',
        icon: <ShoppingBagIcon fontSize="small" />,
        title: 'Đơn chuyển',
      },
      {
        href: '/orders/shares',
        icon: <ShoppingBagIcon fontSize="small" />,
        title: 'Share đơn',
      },
      {
        href: '/accounts',
        icon: <UsersIcon fontSize="small" />,
        title: 'Quản lý tài khoản',
      },
    ]
  }, [user])

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ p: 1 }}>
        <Link to="/">
          <Logo
            sx={{
              height: 42,
              width: 42,
            }}
          />
        </Link>
      </Box>
      <Divider
        sx={{
          borderColor: '#2D3748',
          my: 2,
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        {items.map((item) => (
          <NavItem
            key={item.title}
            icon={item.icon}
            href={item.href}
            title={item.title}
          />
        ))}
      </Box>
      <Divider sx={{ borderColor: '#2D3748' }} />
      <Box
        sx={{
          px: 1,
          py: 3,
        }}
      >
        <Button
          color="info"
          startIcon={<CogIcon />}
          fullWidth
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate('/account')}
        >
          Tài khoản của tôi
        </Button>
      </Box>
    </Box>
  )

  if (lgUp) {
    return open ? (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 240,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    ) : null
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 240,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  )
}
