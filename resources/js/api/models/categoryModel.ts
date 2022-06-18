export interface CreateCategoryParam {
  name: string
  tag: string
  maxUses?: number | null
  time: number
  timeType: string
  activeDate: string
  id?: number
  _u?: string
}

export interface CategoryModel extends Record<string, any> {
  id: number
  name: string
  time: number
  time_type: 'day' | 'month' | 'year'
  max_uses: number
  is_active: boolean
  created_at: string
  updated_at: string
  tag: string
}
export interface CategoryPluckModel {
  value: string
  label: string
  tag: string
}
