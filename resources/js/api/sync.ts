import { defHttp } from '../utils/http'
import { SyncParam, SyncModel } from './models/syncModel'
export const syncProduct = (params: SyncParam) =>
  defHttp.get<SyncModel>({
    url: '/sync/product',
    params,
  })
export const syncProductFromStack = () =>
  defHttp.get<SyncModel>({
    url: '/sync/productFromStack',
  })
export const syncCollectionFromStack = () =>
  defHttp.get<SyncModel>({
    url: '/sync/collectionFromStack',
  })

export const syncProductAndOptimized = (params: SyncParam) =>
  defHttp.get<SyncModel>({
    url: '/sync/product-optimized',
    params,
  })
export const syncOrder = (params: SyncParam) =>
  defHttp.get<SyncModel>({
    url: '/sync/order',
    params,
  })
export const syncCustomer = (params: SyncParam) =>
  defHttp.get<SyncModel>({
    url: '/sync/customer',
    params,
  })

export const syncDetailProduct = (ids: number[]) =>
  defHttp.post({
    url: '/sync/productDetail',
    data: { ids, _s: localStorage.getItem('orgid') },
  })
export const revertProduct = (ids: number[]) =>
  defHttp.post({
    url: '/sync/revert',
    data: { ids, _s: localStorage.getItem('orgid') },
  })
export const syncCollection = () =>
  defHttp.get<SyncModel>({ url: '/sync/collection' })
export const syncProductComponent = () =>
  defHttp.get<SyncModel>({ url: '/sync/product-collection' })
export const getWebhookStack = (type = 'product') =>
  defHttp.get({
    url: `/sync/webhook/${type}`,
  })
