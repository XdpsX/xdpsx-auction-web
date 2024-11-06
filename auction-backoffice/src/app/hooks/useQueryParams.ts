import { useSearchParams } from 'react-router-dom'
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, DEFAULT_PUBLISHED, DEFAULT_SORT } from '~/constants'

export default function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = Object.fromEntries([...searchParams])

  const updateSearchParams = (updatedParams: Record<string, string | number | boolean | null>) => {
    setSearchParams(
      new URLSearchParams(
        Object.entries(updatedParams)
          .filter(([, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => [key, String(value)])
      )
    )
  }

  const setParams = (newParams: Record<string, string | number | boolean | null>) => {
    const updatedParams = { ...params, ...newParams }
    updateSearchParams(updatedParams)
  }

  const deleteParam = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...updatedParams } = params
    updateSearchParams(updatedParams)
  }

  const deleteAllParams = () => {
    const { pageNum, pageSize } = params
    const updatedParams: Record<string, string | number | boolean | null> = {}
    if (pageNum !== undefined) updatedParams.pageNum = pageNum
    if (pageSize !== undefined) updatedParams.pageSize = pageSize
    updateSearchParams(updatedParams)
  }

  return {
    params: {
      pageNum: params.pageNum || DEFAULT_PAGE_NUM,
      pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      keyword: params.keyword || null,
      published: params.published || DEFAULT_PUBLISHED.key,
      sort: params.sort || DEFAULT_SORT.key
    },
    setParams,
    deleteParam,
    deleteAllParams
  }
}
