import type { User } from './models/authModel'
import { defHttp } from '/@/utils/http'
import { StatusEnum, RoleEnum } from '/@/enums/roleEnum'
import { OrderModel } from './models/orderModel'
const indexApi = '/order'

interface CreateOrderData {
  shop: string
  customer_name: string
  customer_phone: string
  customer_address: string
  code?: string | null
  agent: string
  shipper?: string | null
  agent_share?: string | null
}

export const getOrders = (params: any) =>
  defHttp.get<{
    data: OrderModel[]
    total: number
  }>({
    url: indexApi,
    params,
  })

export const createOrder = (data: CreateOrderData) =>
  defHttp.post({
    url: indexApi,
    data,
  })
export const updateOrder = (data: {
  username: string
  password: string
  name: string
  phone: string
  password_confirmation: string
  address: string
  role: RoleEnum
  status: StatusEnum
  id: number
}) =>
  defHttp.put({
    url: indexApi + '/' + data.id,
    data,
  })

export const deleteOrder = (id: number) =>
  defHttp.delete({
    url: indexApi + '/' + id,
  })
