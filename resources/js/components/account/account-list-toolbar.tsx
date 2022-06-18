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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import { Search as SearchIcon } from '../../icons/search'
import { Upload as UploadIcon } from '../../icons/upload'
import { Download as DownloadIcon } from '../../icons/download'
import React, { useCallback, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

interface Props {
  searchKey: string
  onSearchKeyChange: (searchKey: string) => void
  role: string
  onRoleChange: (role: string) => void
  onCreate: () => void
}
const AccountListToolbar: React.FC<Props> = ({
  searchKey,
  onSearchKeyChange,
  role,
  onRoleChange,
  onCreate,
  ...props
}) => {
  const handleChangeSearchKey = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearchKeyChange(event.target.value)
    },
    []
  )
  const handleRoleChange = useCallback((event: SelectChangeEvent) => {
    onRoleChange(event.target.value)
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
          Quản lý tài khoản
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button color="primary" variant="contained" onClick={onCreate}>
            Thêm tài khoản
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item md={8} xs={12}>
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
                  placeholder="Theo tên, username, địa chỉ, số điện thoại, ..."
                  variant="outlined"
                  value={searchKey}
                  onChange={handleChangeSearchKey}
                  label="Tìm kiếm"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-select-small">Vai trò</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={role}
                    label="Vai trò"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="shipper">shipper</MenuItem>
                    <MenuItem value="agent">Agent</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
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

export default AccountListToolbar
