export interface ComponentPrice {
  id: number
  component_id: number
  from_price: number
  to_price: number
  total: number
  created_at: string
  updated_at: string
  display_price: string
}

export interface CreatePriceParams {
  component_id: number
  start_price: number
  end_price: number
}
