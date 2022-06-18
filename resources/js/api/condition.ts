import { defHttp } from '../utils/http'

const indexApi = '/conditions'

export const getListConditions = (params: any) =>
  defHttp.get({ url: indexApi, params })
