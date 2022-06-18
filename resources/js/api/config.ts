import { defHttp } from '/@/utils/http'

const indexApi = '/config'

export const createConfig = (params: any) =>
  defHttp.post({ url: indexApi, data: params })
export const updateConfig = (params: any) =>
  defHttp.put({ url: indexApi + '/' + params.id, data: params })
export const deleteConfig = (id: number) =>
  defHttp.delete({ url: indexApi + '/' + id })
export const getActivity = (id: string | number) =>
  defHttp.get({ url: '/activity/' + id })
export const getConfigByKey = (key: string) =>
  defHttp.get({ url: indexApi + '/key/' + key })
export const getConfig = () => defHttp.get({ url: indexApi })
export const saveConfig = (data: Record<string, string | number>) =>
  defHttp.post({ url: indexApi, data })
export const deleteConfigs = (ids: number[]) =>
  defHttp.post({
    url: indexApi + '/delete',
    data: { ids },
  })
