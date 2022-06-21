import { defHttp } from '/@/utils/http'
import { StatusEnum, RoleEnum } from '/@/enums/roleEnum'
import { Project } from './models/projectModel'
const indexApi = '/project'

interface CreateOrderData {
  name: string
  key: string
  description?: string | null
}

export const getProjects = (params: any) =>
  defHttp.get<{
    data: Project[]
    total: number
    last_page: number
  }>({
    url: indexApi,
    params,
  })

export const showProject = (projectKey: string) =>
  defHttp.get<Project>({
    url: `${indexApi}/${projectKey}`,
  })

export const getMemberAndCategory = (projectKey: string) =>
  defHttp.get({
    url: indexApi + '/' + projectKey + '/memberAndCategory',
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

export const projectPluck = (search_key: string) =>
  defHttp.get<
    {
      name: string
      key: string
    }[]
  >({
    url: '/project/pluck',
    params: {
      search_key,
    },
  })
