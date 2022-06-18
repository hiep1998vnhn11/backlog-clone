import { defHttp } from '/@/utils/http'
import {
  CreateCategoryParam,
  CategoryModel,
  CategoryPluckModel,
} from './models/categoryModel'
import { PaginationParams } from './models/paginationModel'
const indexApi = '/collection'

export function getCollections(params?: PaginationParams) {
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

export const updateCategory = (id: number, params: CreateCategoryParam) =>
  defHttp.put<CategoryModel>({
    url: indexApi + '/' + id,
    params,
  })

export const deleteCategory = (id: number, _u?: string) =>
  defHttp.delete({ url: indexApi + '/' + id, params: { _u } })

export const getPluckCategory = () =>
  defHttp.get<CategoryPluckModel[]>({ url: indexApi + '/pluck' })
