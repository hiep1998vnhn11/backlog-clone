import { defHttp } from '/@/utils/http'
import { StatusEnum, RoleEnum } from '/@/enums/roleEnum'
import { Project } from './models/projectModel'
const indexApi = '/project'

interface CreateOrderData {
  name: string
  key: string
}

export const getProjects = (params: any) =>
  defHttp.get<{
    data: Project[]
    total: number
  }>({
    url: indexApi,
    params,
  })

export const createProject = (data: CreateOrderData) =>
  defHttp.post({
    url: indexApi,
    data,
  })

export const updateOrder = (data: {
  username: string
  password: string
  name: string
  phone: string
  password_confirmation: string
  address: string
  role: RoleEnum
  status: StatusEnum
  id: number
}) =>
  defHttp.put({
    url: indexApi + '/' + data.id,
    data,
  })

export const deleteOrder = (id: number) =>
  defHttp.delete({
    url: indexApi + '/' + id,
  })
