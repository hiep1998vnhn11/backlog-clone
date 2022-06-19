import { defHttp } from '/@/utils/http'
import {
  CreateCategoryParam,
  CategoryModel,
  CategoryPluckModel,
} from './models/categoryModel'
import { PaginationParams } from './models/paginationModel'
import {
  CreateComponentParams,
  ProductComponent,
  ComponentProperty,
  CreatePropertyParam,
} from './models/componentModel'

export interface Category {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}
interface CreateCategoryData {
  project_key: string
  name: string
  description?: string | null
}
const indexApi = '/category'

export function getCategories(projectKey: string) {
  return defHttp.get<Category[]>({
    url: indexApi,
    params: {
      project_key: projectKey,
    },
  })
}

export const createCategory = (data: CreateCategoryData) =>
  defHttp.post<ComponentProperty>({
    url: indexApi,
    data,
  })

export const getCategory = (id: string) =>
  defHttp.get<CategoryModel>({ url: `${indexApi}/${id}` })

export const deleteCategory = (id: number) =>
  defHttp.delete({ url: indexApi + '/' + id })
