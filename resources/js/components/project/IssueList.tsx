import React, { useCallback, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { Issue } from '/@/api/issue'
import { formatDate } from '/@/utils/format'

interface Props {
  issues: Issue[]
  loading: boolean
  page: number
  limit: number
  total: number
  onLimitChange: (limit: number) => void
  onPageChange: (page: number) => void
}
interface CustomerRowProps {
  order: Issue
  selected: boolean
  handleSelectOne: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => void
}

const CustomerRow = ({
  order,
  selected,
  handleSelectOne,
}: CustomerRowProps) => {
  return (
    <TableRow
      hover
      key={order.id}
      selected={selected}
      sx={{ '& > *': { borderBottom: 'unset' } }}
    >
      <TableCell padding="none">
        <Checkbox
          checked={selected}
          onChange={(event) => handleSelectOne(event, order.id)}
          value="true"
        />
      </TableCell>
      <TableCell padding="none">
        <Link to="/" className={`chip-${order.tracker}`}>
          #{order.id}
        </Link>
      </TableCell>
      <TableCell padding="none">{order.tracker}</TableCell>
      <TableCell padding="none">{order.subject}</TableCell>
      <TableCell padding="none">{order.status}</TableCell>
      <TableCell padding="none">{order.priority}</TableCell>
      <TableCell padding="none">{order.assignee_id}</TableCell>
      <TableCell padding="none">{formatDate(order.updated_at)}</TableCell>
      <TableCell padding="none">{order.category_id}</TableCell>
      <TableCell padding="none">{formatDate(order.start_date)}</TableCell>
      <TableCell padding="none">{formatDate(order.due_date)}</TableCell>
      <TableCell padding="none">{order.estimate_time}</TableCell>
      <TableCell padding="none">{order.spent_time}</TableCell>
      <TableCell padding="none">{order.percent_complete}</TableCell>
    </TableRow>
  )
}

const rowPropsAreEqual = (
  prevProps: CustomerRowProps,
  nextProps: CustomerRowProps
) => {
  return (
    prevProps.order.id === nextProps.order.id &&
    prevProps.selected === nextProps.selected
  )
}
const MemoedCustomerRow = React.memo(CustomerRow, rowPropsAreEqual)

const IssueList: React.FC<Props> = ({
  issues,
  loading,
  onPageChange,
  onLimitChange,
  page,
  limit,
  total,
  ...rest
}) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([])

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCustomerIds(issues.map((order) => order.id))
    } else {
      setSelectedCustomerIds([])
    }
  }

  const handleSelectOne = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
      const selectedIndex = selectedCustomerIds.indexOf(id)
      if (selectedIndex === -1) {
        setSelectedCustomerIds((values) => [...values, id])
      } else if (selectedIndex === 0) {
        setSelectedCustomerIds((values) => values.slice(1))
      } else if (selectedIndex === selectedCustomerIds.length - 1) {
        setSelectedCustomerIds((values) => values.slice(0, -1))
      } else if (selectedIndex > 0) {
        setSelectedCustomerIds((values) => [
          ...values.slice(0, selectedIndex),
          ...values.slice(selectedIndex + 1),
        ])
      }
    },
    [selectedCustomerIds]
  )
  const handleLimitChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onLimitChange(+event.target.value)
    },
    []
  )

  const handlePageChange = useCallback((_: any, newPage: number) => {
    onPageChange(newPage + 1)
  }, [])

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="none">
                  <Checkbox
                    checked={selectedCustomerIds.length === issues.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0 &&
                      selectedCustomerIds.length < issues.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell padding="none">#</TableCell>
                <TableCell padding="none">Tracker</TableCell>
                <TableCell padding="none">Subject</TableCell>
                <TableCell padding="none">Status</TableCell>
                <TableCell padding="none">Priority</TableCell>
                <TableCell padding="none">Assignee </TableCell>
                <TableCell padding="none">Updated</TableCell>
                <TableCell padding="none">Category</TableCell>
                <TableCell padding="none">Start date</TableCell>
                <TableCell padding="none">Due date</TableCell>
                <TableCell padding="none">Estimated time</TableCell>
                <TableCell padding="none">Spent time</TableCell>
                <TableCell padding="none">% Done</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td colSpan={14}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '200px',
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </td>
                </tr>
              ) : (
                issues
                  .slice(0, limit)
                  .map((order) => (
                    <MemoedCustomerRow
                      order={order}
                      selected={selectedCustomerIds.includes(order.id)}
                      handleSelectOne={handleSelectOne}
                      key={order.id}
                    />
                  ))
              )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={total}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50, 100]}
        getItemAriaLabel={(index) => `Trang ${index + 1}`}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trên tổng ${count} đơn hàng`
        }
        labelRowsPerPage="Số dòng mỗi trang"
      />
    </Card>
  )
}

export default IssueList
