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
} from '@mui/material'
import { Search as SearchIcon } from '../../icons/search'
import { Upload as UploadIcon } from '../../icons/upload'
import { Download as DownloadIcon } from '../../icons/download'
import { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Link } from 'react-router-dom'

interface Props {
  handleChangeSearchKey: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeSearchShop: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeSearchShipper: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleChangeFromDate: (date: Date | null) => void
  handleChangeToDate: (date: Date | null) => void
  searchKey: string
  searchShop: string
  searchShipper: string
  fromDate: Date | null
  toDate: Date | null
}

const OrderListToolbar: React.FC<Props> = (props) => {
  const {
    handleChangeSearchKey,
    handleChangeSearchShop,
    handleChangeSearchShipper,
    handleChangeFromDate,
    handleChangeToDate,
    searchKey,
    searchShop,
    searchShipper,
    fromDate,
    toDate,
  } = props
  const [value, setValue] = useState<Date | null>(null)
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
          Danh sách đơn hàng
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Nhập file
          </Button>
          <Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Xuất file
          </Button>
          <Button
            LinkComponent={Link}
            color="primary"
            variant="contained"
            to="/orders/create"
          >
            Thêm đơn hàng
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={3}>
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
                  placeholder="Tên, địa chỉ, số điện thoại, ..."
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={3}>
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
                  value={searchShop}
                  onChange={handleChangeSearchShop}
                  placeholder="Shop"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2}>
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
                  value={searchShipper}
                  onChange={handleChangeSearchShipper}
                  placeholder="Shipper"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2}>
                <DatePicker
                  label="Ngày tạo từ"
                  value={fromDate}
                  onChange={handleChangeFromDate}
                  renderInput={(params: any) => (
                    <TextField {...params} fullWidth size="small" />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <DatePicker
                  label="Ngày tạo đến"
                  value={toDate}
                  onChange={handleChangeToDate}
                  renderInput={(params: any) => (
                    <TextField {...params} fullWidth size="small" />
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
