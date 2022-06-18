import {
  Box,
  Container,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import AccountListResults from '../../components/account/account-list-results'
import AccountListToolbar from '../../components/account/account-list-toolbar'
import { getAccounts, createAccount, updateAccount } from '/@/api/account'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { User } from '../../api/models/authModel'
import { useDebounce } from '../../hooks/common'
import Dialog from '/@/components/Dialog'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { phoneRegExp } from '/@/enums/regex'
import useApp from '../../hooks/useApp'
import { StatusEnum, RoleEnum } from '/@/enums/roleEnum'

const Customers = () => {
  const { toastError, toastSuccess } = useApp()
  const [loadingForm, setLoadingForm] = useState(false)
  const [open, setOpen] = useState(false)

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [searchKey, setSearchKey] = useState('')
  const [role, setRole] = useState('')
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
  const [sortField, setSortField] = useState('created_at')
  const [accounts, setAccounts] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const isMounted = useRef(false)
  const idUpdate = useRef(0)
  const [showPassword, setShowPassword] = useState(false)
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      address: '',
      note: '',
      username: '',
      password_confirmation: '',
      password: '',
      role: RoleEnum.SHIPPER,
      status: true,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(255, 'Tên quá dài! Tối đa 255 ký tự')
        .required('Hãy nhập tên tải khoản'),
      username: Yup.string()
        .max(255, 'Username quá dài! Tối đa 255 ký tự')
        .required('Hãy nhập Username'),
      address: Yup.string()
        .max(255, 'Địa chỉ quá dài! Tối đa 255 ký tự')
        .required('Hãy nhập địa chỉ tải khoản'),
      phone: Yup.string()
        .max(12, 'Số điện thoại không hợp lệ')
        .min(10, 'Số điện thoại không hợp lệ')
        .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
        .required('Hãy nhập số điện thoại tải khoản'),
      password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Hãy nhập mật khẩu tải khoản'),
      password_confirmation: Yup.string()
        .equals(
          [Yup.ref('password'), 'Mật khẩu không khớp'],
          'Mật khẩu không khớp'
        )
        .required('Hãy nhập xác nhận mật khẩu'),
    }),
    onSubmit: async () => {
      try {
        setLoadingForm(true)
        if (!idUpdate.current) {
          await createAccount({
            ...formik.values,
            status: formik.values.status
              ? StatusEnum.ACTIVE
              : StatusEnum.INACTIVE,
          })
          toastSuccess('Tạo tài khoản thành công!')
        } else {
          const data = JSON.parse(
            JSON.stringify({
              ...formik.values,
              id: idUpdate.current,
              status: formik.values.status
                ? StatusEnum.ACTIVE
                : StatusEnum.INACTIVE,
            })
          )
          if (!showPassword) {
            data.password = undefined
            data.password_confirmation = undefined
          }
          await updateAccount(data)
          toastSuccess('Cập nhật tài khoản thành công')
        }
        formik.handleReset({})
        toggleOpen()
        fetchAccount()
      } catch (err: any) {
        const errors: Record<string, string[]> = err.data.errors
        formik.setErrors(errors)
      } finally {
        setLoadingForm(false)
      }
    },
  })
  const toggleOpen = useCallback(
    () =>
      setOpen((value) => {
        if (value) {
          idUpdate.current = 0
        }
        return !value
      }),
    []
  )
  const handleEdit = useCallback(
    (id: number) => {
      const index = accounts.findIndex((item) => item.id === id)
      if (index !== -1) {
        idUpdate.current = id
        const roleName = accounts[index].roles[0].name
        formik.setValues({
          ...accounts[index],
          status: accounts[index].status === StatusEnum.ACTIVE,
          role:
            roleName === 'admin'
              ? RoleEnum.ADMIN
              : roleName === 'agent'
              ? RoleEnum.AGENT
              : RoleEnum.SHIPPER,
          password: '123123',
          password_confirmation: '123123',
          note: accounts[index].note || '',
        })
        toggleOpen()
        setShowPassword(false)
      }
    },
    [accounts]
  )
  const handleChangeShowPassword = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setShowPassword(checked)
      if (!checked) {
        formik.setFieldValue('password', '123123')
        formik.setFieldValue('password_confirmation', '123123')
      } else {
        formik.setFieldValue('password', '')
        formik.setFieldValue('password_confirmation', '')
      }
    },
    []
  )
  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAccounts({
        limit,
        page,
        search_key: searchKey,
        role,
        sort_by: sortField,
        sort_type: sortDirection,
      })
      if (isMounted.current) {
        setAccounts(response.data)
        setTotal(response.total)
      }
    } catch (err) {
      console.warn(err)
      if (isMounted.current) {
        setAccounts([])
        setTotal(0)
      }
    } finally {
      setLoading(false)
    }
  }, [limit, page, searchKey, role, sortDirection, sortField])

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortDirection('asc')
      }
    },
    [sortField, sortDirection]
  )

  useDebounce(() => fetchAccount(), 350, [searchKey, role])
  useEffect(() => {
    isMounted.current = true
    fetchAccount()
    return () => {
      isMounted.current = false
    }
  }, [page, limit, sortDirection, sortField])

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: 2,
      }}
    >
      <Container maxWidth={false}>
        <AccountListToolbar
          searchKey={searchKey}
          role={role}
          onSearchKeyChange={setSearchKey}
          onRoleChange={setRole}
          onCreate={toggleOpen}
        />
        <Box sx={{ mt: 3 }}>
          <AccountListResults
            accounts={accounts}
            loading={loading}
            page={page - 1}
            limit={limit}
            total={total}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onEdit={handleEdit}
            refresh={fetchAccount}
            sortDirection={sortDirection}
            sortField={sortField}
            onSort={handleSort}
          />
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={toggleOpen}
        title="Tạo tài khoản mới"
        loading={loadingForm}
        onConfirm={formik.handleSubmit}
      >
        <Box sx={{ width: '800px', maxWidth: '100%' }}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(
                  formik.touched.username && formik.errors.username
                )}
                helperText={formik.touched.username && formik.errors.username}
                fullWidth
                label="Username"
                name="username"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
                variant="outlined"
                required
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
            {idUpdate.current !== 0 && (
              <Grid item md={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={showPassword}
                      onChange={handleChangeShowPassword}
                    />
                  }
                  label="Đổi mật khẩu cho tài khoản"
                />
              </Grid>
            )}
            {idUpdate.current === 0 || showPassword ? (
              <>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(
                      formik.touched.password && formik.errors.password
                    )}
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    fullWidth
                    label="Mật khẩu"
                    name="password"
                    required
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    variant="outlined"
                    type="password"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(
                      formik.touched.password_confirmation &&
                        formik.errors.password_confirmation
                    )}
                    helperText={
                      formik.touched.password_confirmation &&
                      formik.errors.password_confirmation
                    }
                    fullWidth
                    label="Nhập lại mật khẩu"
                    name="password_confirmation"
                    required
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password_confirmation}
                    variant="outlined"
                    type="password"
                  />
                </Grid>
              </>
            ) : null}

            <Grid item md={6} xs={12}>
              <FormControl size="small" fullWidth>
                <InputLabel id="role-select-small">Vai trò</InputLabel>
                <Select
                  labelId="role-select-small"
                  id="role-select-small"
                  value={formik.values.role}
                  label="Vai trò"
                  onChange={formik.handleChange}
                  name="role"
                >
                  <MenuItem value={RoleEnum.SHIPPER}>Shipper</MenuItem>
                  <MenuItem value={RoleEnum.AGENT}>Agent</MenuItem>
                  <MenuItem value={RoleEnum.ADMIN}>Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                    name="status"
                  />
                }
                label="Kích hoạt tài khoản"
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
        </Box>
      </Dialog>
    </Box>
  )
}
export default Customers
