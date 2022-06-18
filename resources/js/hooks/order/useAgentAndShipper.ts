import { getAgentAndShipper } from '/@/api/account'
import { AccountCompress } from '/@/api/models/accountModel'
import { useRef, useState, useCallback, useEffect } from 'react'

export interface LabelOption {
  label: string
  value: string
}
export const useAgentAndShipper = () => {
  const [agentOptions, setAgentOptions] = useState<LabelOption[]>([])
  const [shipperOptions, setShipperOptions] = useState<LabelOption[]>([])
  const [loading, setLoading] = useState(false)

  const mountedRef = useRef(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAgentAndShipper()
      if (mountedRef.current) {
        const mapFn = (item: AccountCompress) => ({
          value: item.id + '',
          label: item.name || item.phone,
        })
        setAgentOptions(res.agents.map(mapFn))
        setShipperOptions(res.shippers.map(mapFn))
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      fetchData()
    }
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    agentOptions,
    shipperOptions,
    loading,
  }
}
