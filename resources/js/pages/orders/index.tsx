import { Box, Container } from '@mui/material'
import OrderListResult from '/@/components/order/OrderListResult'
import OrderListToolbar from '/@/components/order/OrderListToolbar'
import { getOrders } from '/@/api/order'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '/@/hooks/common'
import useApp from '/@/hooks/useApp'
import { OrderModel } from '/@/api/models/orderModel'

const OrderPage = () => {
  const { toastError, toastSuccess } = useApp()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [searchKey, setSearchKey] = useState('')
  const [searchShop, setSearchShop] = useState('')
  const [searchShipper, setSearchShipper] = useState('')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
  const [sortField, setSortField] = useState('created_at')
  const [orders, setOrders] = useState<OrderModel[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const isMounted = useRef(false)
  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getOrders({
        limit,
        page,
        search_key: searchKey,
        sort_by: sortField,
        sort_type: sortDirection,
        shop: searchShop,
        shipper: searchShipper,
        from_date: fromDate?.toISOString().split('T')[0],
        to_date: toDate?.toISOString().split('T')[0],
      })
      if (isMounted.current) {
        setOrders(response.data)
        setTotal(response.total)
      }
    } catch (err) {
      console.warn(err)
      if (isMounted.current) {
        setOrders([])
        setTotal(0)
      }
    } finally {
      setLoading(false)
    }
  }, [
    limit,
    page,
    searchKey,
    sortDirection,
    sortField,
    searchShipper,
    searchShop,
    fromDate,
    toDate,
  ])

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

  useDebounce(() => fetchOrder(), 350, [
    searchKey,
    searchShop,
    searchShipper,
    fromDate,
    toDate,
  ])
  useEffect(() => {
    isMounted.current = true
    fetchOrder()
    return () => {
      isMounted.current = false
    }
  }, [page, limit, sortDirection, sortField])

  const handleChangeSearchKey = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKey(e.target.value)
    },
    []
  )
  const handleChangeSearchShop = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchShop(e.target.value)
    },
    []
  )
  const handleChangeSearchShipper = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchShipper(e.target.value)
    },
    []
  )
  const handleChangeFromDate = useCallback((date: Date | null) => {
    setFromDate(date)
  }, [])
  const handleChangeToDate = useCallback((date: Date | null) => {
    setToDate(date)
  }, [])

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: 2,
      }}
    >
      <Container maxWidth={false}>
        <OrderListToolbar
          searchKey={searchKey}
          searchShipper={searchShipper}
          searchShop={searchShop}
          fromDate={fromDate}
          toDate={toDate}
          handleChangeSearchKey={handleChangeSearchKey}
          handleChangeSearchShipper={handleChangeSearchShipper}
          handleChangeSearchShop={handleChangeSearchShop}
          handleChangeFromDate={handleChangeFromDate}
          handleChangeToDate={handleChangeToDate}
        />
        <Box sx={{ mt: 3 }}>
          <OrderListResult
            orders={orders}
            loading={loading}
            page={page - 1}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            total={total}
          />
        </Box>
      </Container>
    </Box>
  )
}
export default OrderPage
