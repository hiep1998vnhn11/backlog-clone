export interface VoucherModel {
  id: number
  code: string
  name: string
  customer_name: string
  customer_address: string
  customer_phone: string
  birthday: string
  gender: null | '0' | '1'
  remain_use: number
  is_active: number
  expired_at: string
  start_at: string
  created_at: string
  updated_at: string
  order_code: string
  media_path: string
  expire_at: string
  media_id: number
  deal_name: string
  time: number
  time_type: 'day' | 'month' | 'year'
  sku: string
  isExpand?: boolean
  child_name: string
  image_path: string | null
  parent_phone: string
  address: string
  max_use: number
  active_at: string
}

export interface SearchVoucherModel {
  id: number
  code: string
  customer_name: string
  customer_phone: string
  remain_use: number
  is_active: boolean
  expire_at: string
  start_at: string
  order_code: string
  deal_name: string
  sku: string
  image_path: string | null
  child_name: string
  quantity?: number
  max_use: number
}

export interface CreateVoucherModelParams {
  id?: number
  code: string
  child_name?: string
  birthday?: string
  is_active?: boolean
  order_code?: string
  sku: string
  customer_name?: string
  customer_phone?: string
  parent_phone?: string
  category_id: string
  gender?: string
}

export interface VoucherHistoryModel {
  id: number
  created_at: string
  voucher_id: number
}

export interface UpdateVoucherParams {
  name: string
  description: string
  is_active: boolean
  code: string
  start_at: string
  expire_at: string
  remain_use: number
  customer_name: string
  customer_address: string
  customer_birthday: string
  gender: string
  customer_phone: string
  file: File | null
  media_id: number
  media_path: string
}
