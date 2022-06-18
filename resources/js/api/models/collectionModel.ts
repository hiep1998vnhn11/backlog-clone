export interface Collection {
  id: number
  name: string
  tenant: string
  created_at: string
  updated_at: string
  component_id: number | null
  collection_shop_id: number
  component_name?: string | null
}
