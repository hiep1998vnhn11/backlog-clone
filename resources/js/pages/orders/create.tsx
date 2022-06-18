import {
  Box,
  Container,
  Grid,
  Icon,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Autocomplete,
} from '@mui/material'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCallback, useMemo, useState } from 'react'
import { ArrowBack } from '@mui/icons-material'
import useAuth from '../../context/useAuth'
import * as Yup from 'yup'
import useApp from '../../context/useApp'
import { phoneRegExp } from '/@/enums/regex'
import { LoadingButton } from '@mui/lab'
import { createOrder } from '/@/api/order'
import { useFormik } from 'formik'
import {
  useAgentAndShipper,
  LabelOption,
} from '/@/hooks/order/useAgentAndShipper'

const CreateOrder = () => {
  const { toastError, toastSuccess } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [agent, setAgent] = useState<LabelOption | null>(null)
  const [shipper, setShipper] = useState<LabelOption | null>(null)
  const [agentShare, setAgentShare] = useState<LabelOption | null>(null)
  const [note, setNote] = useState('')
  const [orderCode, setOrderCode] = useState('')
  const [shop, setShop] = useState('')
  const [shopError, setShopError] = useState('')
  const [agentError, setAgentError] = useState('')
  const {
    shipperOptions,
    agentOptions,
    loading: loadingOption,
  } = useAgentAndShipper()

  const formik = useFormik({
    initialValues: {
      note: '',
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      customer_note: '',
    },
    validationSchema: Yup.object({
      customer_phone: Yup.string()
        .max(12, 'Số điện thoại không hợp lệ')
        .min(10, 'Số điện thoại không hợp lệ')
        .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
        .required('Hãy nhập số điện thoại của bạn'),
      customer_name: Yup.string()
        .required('Hãy nhập tên khách hàng')
        .max(255, 'Tên khách hàng không hợp lệ, tối đa 255 ký tự'),
      customer_address: Yup.string()
        .max(255, 'Địa chỉ không hợp lệ, tối đa 255 ký tự')
        .required('Hãy nhập địa chỉ khách hàng'),
    }),
    onSubmit: async () => {
      if (!agent) return setAgentError('Hãy chọn Agent tiếp nhận đơn hàng!')
      try {
        setLoading(true)
        await createOrder({
          ...formik.values,
          code: orderCode,
          shop,
          agent: agent.value,
          shipper: shipper?.value,
          agent_share: agentShare?.value,
        })
        formik.handleReset({})
        toastSuccess('Tạo đơn hàng thành công!')
        navigate('/orders')
      } catch (err: any) {
        toastError(
          'Tạo đơn hàng thất bại! Hãy điền các thông tin còn thiếu để tiếp tục tạo mới'
        )
        const errors = err.data.errors as Record<string, string[]>
        Object.entries(errors).forEach(([key, value]) => {
          if (key === 'shop') {
            setShopError(value[0])
          }
        })
        formik.setErrors(err.data.errors)
      } finally {
        setLoading(false)
      }
    },
  })

  const handleNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value),
    []
  )
  const handleOrderCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setOrderCode(e.target.value),
    []
  )
  const handleShopChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setShop(e.target.value),
    []
  )
  const handleAgentChange = useCallback(
    (_: React.SyntheticEvent, value: any) => {
      if (!value) setAgentError('Hãy chọn Agent tiếp nhận đơn hàng!')
      else setAgentError('')
      setAgent(value)
    },
    []
  )
  const handleAgentShareChange = useCallback(
    (_: React.SyntheticEvent, value: any) => {
      setAgentShare(value)
    },
    []
  )
  const handleShipperChange = useCallback(
    (_: React.SyntheticEvent, value: any) => {
      setShipper(value)
    },
    []
  )
  const handleShopBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === '') {
        setShopError('Hãy nhập tên cửa hàng')
      }
    },
    []
  )
  const isError = useMemo(() => {
    return (
      Boolean(shopError) ||
      Boolean(agentError) ||
      Object.keys(formik.errors).length > 0
    )
  }, [formik.errors, shopError])

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2,
      }}
    >
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Container maxWidth="lg">
          <Link className="link icon" to="/orders">
            <Icon>
              <ArrowBack />
            </Icon>
            Danh sách đơn hàng
          </Link>
          <div className="flex justify-between">
            <Typography sx={{ mb: 3 }} variant="h5">
              Tạo đơn hàng mới
            </Typography>
            <div>
              <LoadingButton
                color="primary"
                variant="contained"
                disabled={isError}
                loading={loading}
                type="submit"
              >
                Lưu
              </LoadingButton>
            </div>
          </div>
          <Grid container spacing={3}>
            <Grid item lg={8} md={6} xs={12}>
              <Card>
                <CardHeader
                  title="Thông tin người nhận"
                  sx={{
                    p: 2,
                  }}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={Boolean(
                          formik.touched.customer_name &&
                            formik.errors.customer_name
                        )}
                        helperText={
                          formik.touched.customer_name &&
                          formik.errors.customer_name
                        }
                        fullWidth
                        label="Họ tên người nhận"
                        name="customer_name"
                        required
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.customer_name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={Boolean(
                          formik.touched.customer_phone &&
                            formik.errors.customer_phone
                        )}
                        helperText={
                          formik.touched.customer_phone &&
                          formik.errors.customer_phone
                        }
                        fullWidth
                        label="Số điện thoại"
                        name="customer_phone"
                        required
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.customer_phone}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={Boolean(
                          formik.touched.customer_address &&
                            formik.errors.customer_address
                        )}
                        helperText={
                          formik.touched.customer_address &&
                          formik.errors.customer_address
                        }
                        fullWidth
                        label="Địa chỉ người nhận"
                        name="customer_address"
                        required
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.customer_address}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Ghi chú của người nhận (nếu có)"
                        name="customer_note"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.customer_note}
                        variant="outlined"
                        rows={4}
                        multiline
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <Card>
                <CardHeader sx={{ p: 2 }} title="Thông tin đơn hàng" />
                <CardContent sx={{ px: 2, py: 0 }}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Mã đơn"
                        name="code"
                        onChange={handleOrderCodeChange}
                        value={orderCode}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Shop"
                        name="shop"
                        onChange={handleShopChange}
                        value={shop}
                        variant="outlined"
                        required
                        error={Boolean(shopError)}
                        helperText={shopError}
                        onBlur={handleShopBlur}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Ghi chú (nếu có)"
                        name="description"
                        onChange={handleNoteChange}
                        value={note}
                        variant="outlined"
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card className="mt-4">
                <CardHeader sx={{ p: 2 }} title="Thông tin tiếp nhận" />
                <CardContent sx={{ px: 2, py: 0 }}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <Autocomplete
                        value={agent}
                        loading={loadingOption}
                        loadingText="Đang tìm..."
                        disablePortal
                        onChange={handleAgentChange}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        options={agentOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Agent"
                            required
                            onBlur={formik.handleBlur}
                            error={Boolean(agentError)}
                            helperText={agentError}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Autocomplete
                        value={agentShare}
                        loading={loadingOption}
                        loadingText="Đang tìm..."
                        disablePortal
                        onChange={handleAgentShareChange}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        options={agentOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Agent share"
                            required
                            onBlur={formik.handleBlur}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Autocomplete
                        value={shipper}
                        loading={loadingOption}
                        loadingText="Đang tìm..."
                        disablePortal
                        onChange={handleShipperChange}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        options={shipperOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Shipper"
                            required
                            onBlur={formik.handleBlur}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <LoadingButton
            color="primary"
            variant="contained"
            disabled={isError}
            loading={loading}
            type="submit"
          >
            Lưu
          </LoadingButton>
        </Container>
      </form>
    </Box>
  )
}
export default CreateOrder
