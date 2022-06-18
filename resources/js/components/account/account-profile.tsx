import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@mui/material'
import useAuth from '/@/hooks/useAuth'
import Dropzone from '/@/components/Dropzone'
import { useCallback, useState } from 'react'
import Dialog from '/@/components/Dialog'
import { uploadApi } from '/@/api/upload'
import useApp from '/@/hooks/useApp'
export const AccountProfile: React.FC<any> = (props) => {
  const { user, updateUser } = useAuth()
  const { toastError, toastSuccess } = useApp()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const toggleOpen = useCallback(() => setOpen((value) => !value), [])

  const handleUpload = useCallback(async () => {
    if (!file) return toastError('Hãy chọn file ảnh để tải lên!')
    try {
      setLoading(true)
      const res = await uploadApi({ file })
      updateUser({ ...user!, avatar: res })
      toastSuccess('Cập nhật ảnh đại diện thành công!')
      setOpen(false)
    } catch (err) {
      toastError('Cập nhật ảnh đại diện thất bại! Hãy thử lại sau!')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [file])
  return (
    <>
      <Card {...props}>
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Avatar
              src={user!.avatar || ''}
              sx={{
                height: 64,
                mb: 2,
                width: 64,
              }}
            />
            <Typography color="textPrimary" gutterBottom variant="h5">
              {user!.name}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {user!.phone}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {user!.note}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" fullWidth variant="text" onClick={toggleOpen}>
            Tải lên ảnh đại diện
          </Button>
        </CardActions>
      </Card>
      <Dialog
        open={open}
        onClose={toggleOpen}
        title="Tải ảnh đại diện"
        onConfirm={handleUpload}
        loading={loading}
      >
        <Dropzone file={file} setFile={setFile} />
      </Dialog>
    </>
  )
}
