import React, { useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import useApp from '../hooks/useApp'
import { Avatar, Box } from '@mui/material'

interface Props {
  file: File | null
  setFile: (file: File | null) => void
}
const Dropzone: React.FC<Props> = ({ file, setFile }) => {
  const { toastError } = useApp()
  const onDrop = useCallback((acceptedFiles: File[], rejectedFile: any[]) => {
    if (rejectedFile.length > 0) {
      return toastError('Hãy chọn duy nhất 1 file ảnh dưới 2MB để tải lên!')
    }
    setFile(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 2 * 1000 * 1000,
  })

  const avatar = useMemo(() => {
    if (!file) return null
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Avatar
          src={URL.createObjectURL(file)}
          sx={{
            height: 128,
            mb: 2,
            width: 128,
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        />
      </Box>
    )
  }, [file])

  return (
    <div>
      {avatar}
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} multiple={false} />
        {isDragActive ? (
          <p>Thả file xuống để tải lên</p>
        ) : (
          <p>Kéo thả hoặc bấm vào đây để tải lên (file nhỏ hơn 2MB)</p>
        )}
      </div>
    </div>
  )
}
export default Dropzone
