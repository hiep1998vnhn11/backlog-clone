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

const indexApi = '/property'

export function getTags(params?: PaginationParams) {
  return defHttp.get<CategoryModel[]>({
    url: indexApi,
    params,
  })
}

export const createProperty = (data: CreatePropertyParam) =>
  defHttp.post<ComponentProperty>({
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

export const updateProperty = (id: number, data: CreatePropertyParam) =>
  defHttp.put<ComponentProperty>({
    url: indexApi + '/' + id,
    data,
  })

export const deleteProperty = (id: number) =>
  defHttp.delete({ url: indexApi + '/' + id })

export const getPluckCategory = () =>
  defHttp.get<CategoryPluckModel[]>({ url: indexApi + '/pluck' })
