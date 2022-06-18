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
  AssignCollectionsParams,
} from './models/componentModel'

const indexApi = '/component'

export function getComponents(params?: PaginationParams) {
  return defHttp.get<any[]>({
    url: indexApi,
    params,
  })
}

export const createComponent = (data: CreateComponentParams) =>
  defHttp.post<ProductComponent>({
    url: indexApi,
    data,
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

export const deleteComponment = (id: number) =>
  defHttp.delete({ url: indexApi + '/' + id })

export const getPluckCategory = () =>
  defHttp.get<CategoryPluckModel[]>({ url: indexApi + '/pluck' })

export const assignCollections = (data: AssignCollectionsParams) =>
  defHttp.post({
    url: indexApi + '/assign',
    data,
  })
export const unassignCollection = (data: { id: number }) =>
  defHttp.post({
    url: indexApi + '/unassign',
    data,
  })
export const swapComponent = (data: { from: number; to: number }) =>
  defHttp.post({
    url: indexApi + '/swap',
    data,
  })
export const swapProperty = (data: { from: number; to: number }) =>
  defHttp.post({
    url: indexApi + '/swapProperty',
    data,
  })
