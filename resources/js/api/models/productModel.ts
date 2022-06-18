export interface Product {
  id: number
  product_shop_id: number
  shop_id: number
  name: string
  is_optimized: number
  created_at: string
  updated_at: string
  total_images: number
  optimized_images: number
  loadingRevert?: boolean
  loadingOptimize?: boolean
  slug: string
  component_name: string
  tags: string
  variant_shop_id: number
}
