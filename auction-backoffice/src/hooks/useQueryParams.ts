import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries([...searchParams])

  return {
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 10,
    keyword: params.keyword || null,
    hasPublished: params.hasPublished || null,
    sort: params.sort || null
  }
}
