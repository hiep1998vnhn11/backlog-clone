export interface Tag {
  id: number
  name: string
  prefix: string
  description: string
  created_at: string
  updated_at: string
}

export interface ComponentProperty {
  id: number
  name: string
  component_name: string
  component_id: number
  total: number
  potision: number
  created_at: string
  updated_at: string
  tag_extract: string
}
