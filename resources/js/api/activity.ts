import { defHttp } from '/@/utils/http'
import {
  CreateCategoryParam,
  CategoryModel,
  CategoryPluckModel,
} from './models/categoryModel'
import { PaginationParams } from './models/paginationModel'
const indexApi = '/activity'
export interface Activity {
  id: number
  project_id: number
  user_id: number
  type: string
  created_at: string
  user_name: string | null
  issue_subject: string
  data: {
    label: number
    link: string
  }
}

export function getActivities(params: any) {
  return defHttp.get<Record<string, Activity[]>>({
    url: indexApi,
    params,
  })
}
