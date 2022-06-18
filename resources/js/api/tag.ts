import { defHttp } from '/@/utils/http'
import {
  CreateCategoryParam,
  CategoryModel,
  CategoryPluckModel,
} from './models/categoryModel'
import { PaginationParams } from './models/paginationModel'

const indexApi = '/tag'

export function getTags(params?: PaginationParams) {
  return defHttp.get<CategoryModel[]>({
    url: indexApi,
    params,
  })
}

export const createCategory = (params: CreateCategoryParam) =>
  defHttp.post<CategoryModel>({
    url: indexApi,
    params,
  })

export const getCategory = (id: string) =>
  defHttp.get<CategoryModel>({ url: `${indexApi}/${id}` })

export const activeCategory = (params: { id: number; isActive?: boolean }) =>
  defHttp.post({
    url: indexApi + '/' + params.id + '/active',
    params,
  })

export const updateTag = (id: number, data: { tag: string }) =>
  defHttp.put<CategoryModel>({
    url: indexApi + '/' + id,
    data,
  })

export const deleteTags = (ids: number[]) =>
  defHttp.post({ url: indexApi + '/delete', data: { ids } })

export const getPluckCategory = () =>
  defHttp.get<CategoryPluckModel[]>({ url: indexApi + '/pluck' })
