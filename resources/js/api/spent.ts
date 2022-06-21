import { defHttp } from '/@/utils/http'
import {
  CreateCategoryParam,
  CategoryModel,
  CategoryPluckModel,
} from './models/categoryModel'
import { PaginationParams } from './models/paginationModel'

const indexApi = '/spent'

export interface SpentTime {
  assignee_id: null | number
  category_id: null | number
  created_at: string
  description: null | string
  due_date: null | string
  estimate_time: number
  spent_time: number
  id: number
  level: string
  percent_complete: number
  priority: string
  project_id: number
  status: string
  subject: string
  tracker: string
  updated_at: string
  user_id: number
  start_date: string | null
  assignee_name?: null | string
  category_name?: null | string
  user?: {
    name: string
  }
  category?: {
    name: string
  }
  assignee?: {
    name: string
  }
  comments?: {
    id: number
  }[]
}
interface CreateIssueData {
  project_key: string
  issue_id: number
  user_id: number
  hours: number
  comment: string
  date: string
  activity: string
}

export function getListSpents(params: any) {
  return defHttp.get<{
    data: SpentTime[]
    total: number
  }>({
    url: indexApi,
    params,
  })
}

export const createSpent = (data: CreateIssueData) =>
  defHttp.post<number>({
    url: indexApi,
    data,
  })

export const getSpent = (id: string | number, projectKey: string) =>
  defHttp.get<SpentTime>({
    url: `${indexApi}/${id}`,
    params: {
      project_key: projectKey,
    },
  })

export const activeCategory = (params: { id: number; isActive?: boolean }) =>
  defHttp.post({
    url: indexApi + '/' + params.id + '/active',
    params,
  })

export const updateIssue = (id: number, data: CreateIssueData) =>
  defHttp.put<CategoryModel>({
    url: indexApi + '/' + id,
    data,
  })

export const deleteCategory = (id: number, _u?: string) =>
  defHttp.delete({ url: indexApi + '/' + id, params: { _u } })

export const getPluckCategory = () =>
  defHttp.get<CategoryPluckModel[]>({ url: indexApi + '/pluck' })