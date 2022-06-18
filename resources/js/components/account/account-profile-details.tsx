import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@mui/material'
import useAuth from '/@/hooks/useAuth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useApp from '/@/hooks/useApp'
import { phoneRegExp } from '/@/enums/regex'
import { LoadingButton } from '@mui/lab'
import { changeInfoApi } from '/@/api/auth'

export const AccountProfileDetails: React.FC<any> = (props) => {
  const { user, updateUser } = useAuth()
  const { toastError, toastSuccess } = useApp()
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      name: user!.name,
      phone: user!.phone,
      address: user!.address,
      note: user!.note,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(255, 'Tên quá dài! Tối đa 255 ký tự')
        .required('Hãy nhập tên của bạn'),
      address: Yup.string()
        .max(255, 'Địa chỉ quá dài! Tối đa 255 ký tự')
        .required('Hãy nhập địa chỉ của bạn'),
      phone: Yup.string()
        .max(12, 'Số điện thoại không hợp lệ')
        .min(10, 'Số điện thoại không hợp lệ')
        .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
        .required('Hãy nhập số điện thoại của bạn'),
    }),
    onSubmit: async () => {
      try {
        setLoading(true)
        await changeInfoApi(formik.values)
        updateUser({
          ...user!,
          ...formik.values,
        })
        toastSuccess('Cập nhật thông tin thành công')
      } catch (err: any) {
        formik.setErrors(err.data.errors)
      } finally {
        setLoading(false)
      }
    },
  })
  const isError = useMemo(
    () => Object.keys(formik.errors).length > 0,
    [formik.errors]
  )

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          title="Thông tin cá nhân"
          subheader="Bạn có thể chỉnh sửa thông tin cá nhân của bạn"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Được dùng để đăng nhập, không thể thay đổi!"
                label="Username"
                name="username"
                value={user!.username}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                label="Họ tên"
                name="name"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.address && formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                fullWidth
                label="Địa chỉ"
                name="address"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.phone && formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                fullWidth
                label="Số điện thoại"
                name="phone"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="note"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.note}
                variant="outlined"
                rows={4}
                multiline
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
          }}
        >
          <LoadingButton
            color="primary"
            variant="contained"
            disabled={isError}
            loading={loading}
            type="submit"
          >
            Lưu
          </LoadingButton>
        </Box>
      </Card>
    </form>
  )
}
