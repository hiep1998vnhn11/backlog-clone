import type { User } from './models/authModel'
import { defHttp } from '/@/utils/http'
import { StatusEnum, RoleEnum } from '/@/enums/roleEnum'
import { AccountCompress } from './models/accountModel'
const indexApi = '/account'

export const getAccounts = (params: any) =>
  defHttp.get<{
    data: User[]
    total: number
  }>({
    url: indexApi,
    params,
  })

export const createAccount = (data: {
  username: string
  password: string
  name: string
  phone: string
  password_confirmation: string
  address: string
  role: RoleEnum
  status: StatusEnum
}) =>
  defHttp.post({
    url: indexApi,
    data,
  })
export const updateAccount = (data: {
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

export const deleteAccount = (id: number) =>
  defHttp.delete({
    url: indexApi + '/' + id,
  })

export const getAgentAndShipper = () =>
  defHttp.get<{
    shippers: AccountCompress[]
    agents: AccountCompress[]
  }>({ url: indexApi + '/getAgentAndShipper' })
