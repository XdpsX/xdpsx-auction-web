import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = Object.fromEntries([...searchParams])

  const setParams = (newParams: Record<string, string | number | boolean | null>) => {
    const updatedParams = { ...params, ...newParams }
    setSearchParams(
      new URLSearchParams(
        Object.entries(updatedParams)
          .filter(([, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => [key, String(value)])
      )
    )
  }

  const deleteParam = (key: string) => {
    const updatedParams = { ...params }
    delete updatedParams[key]
    setSearchParams(
      new URLSearchParams(
        Object.entries(updatedParams)
          .filter(([, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => [key, String(value)])
      )
    )
  }

  const deleteAllParams = () => {
    const { pageNum, pageSize } = params
    const updatedParams: Record<string, string | number | boolean | null> = {}
    if (pageNum !== undefined) updatedParams.pageNum = pageNum
    if (pageSize !== undefined) updatedParams.pageSize = pageSize
    setSearchParams(
      new URLSearchParams(
        Object.entries(updatedParams)
          .filter(([, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => [key, String(value)])
      )
    )
  }

  return { params, setParams, deleteParam, deleteAllParams }
}
