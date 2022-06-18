import { defHttp } from '/@/utils/http'
import {
  CreateCategoryParam,
  CategoryModel,
  CategoryPluckModel,
} from './models/categoryModel'
import { PaginationParams } from './models/paginationModel'
import { LocationAndAccount, CheckInModelDetail } from './models/checkInModel'
const indexApi = '/checkin'

export const getCheckin = (params: PaginationParams) =>
  defHttp.get({ url: indexApi, params })
export const createCheckin = (params: {
  voucher_id: number[]
  tags: string[]
  description?: string
  account?: string
  location?: string
  customer_phone: string
  customer_name?: string
  location_name?: string
  location_phone?: string
  location_address?: string
  account_name?: string

  _u?: string
}) => defHttp.post({ url: indexApi, data: params })

export const getLocationAndAccount = (params: any) =>
  defHttp.get<LocationAndAccount>({
    url: indexApi + '/accountAndLocation',
    params,
  })

export const getCustomer = (params: PaginationParams) =>
  defHttp.get({ url: indexApi + '/customer', params })
export const getDetail = (id: number | string) =>
  defHttp.get<CheckInModelDetail[]>({ url: indexApi + '/' + id + '/detail' })

export const getCheckinDetail = ({ id }: { id: number | string }) =>
  defHttp.get({ url: indexApi + '/' + id })
export const activeCheckin = ({
  id,
  is_active,
  _u,
}: {
  id: number | string
  is_active?: boolean
  _u?: any
}) =>
  defHttp.post({
    url: indexApi + '/' + id + '/active',
    params: { is_active, _u },
  })
