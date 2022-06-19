import { getMemberAndCategory } from '/@/api/project'
export interface OptionItem {
  value: number
  label: string
}
export function useMemberAndCategory(projectKey: string) {
  const [members, setMembers] = useState<OptionItem[]>([])
  const [categories, setCategories] = useState<OptionItem[]>([])
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response: {
        members: OptionItem[]
        categories: OptionItem[]
      } = await getMemberAndCategory(projectKey)
      if (isMounted.current) {
        setMembers(response.members)
        setCategories(response.categories)
      }
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      fetchData()
    }

    return () => {
      isMounted.current = false
    }
  }, [])

  return {
    members,
    categories,
    loading,
  }
}
