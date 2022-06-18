import { defHttp } from '/@/utils/http'
import { CreatePriceParams, ComponentPrice } from './models/priceModel'

const indexApi = '/price'

export const createPrice = (data: CreatePriceParams) =>
  defHttp.post<ComponentPrice>({
    url: indexApi,
    data,
  })

export const updatePrice = (id: number, data: CreatePriceParams) =>
  defHttp.put<ComponentPrice>({
    url: indexApi + '/' + id,
    data,
  })

export const deletePrice = (id: number) =>
  defHttp.delete({ url: indexApi + '/' + id })
