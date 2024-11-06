import { Category } from '~/types/category'
import { Page } from '~/types/page'
import api from '~/utils/api'

export const fetchAllCategoriesAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string,
  hasPublished?: boolean | null
): Promise<Page<Category>> => {
  const response = await api.get<Page<Category>>('/backoffice/categories/paging', {
    params: {
      pageNum,
      pageSize,
      keyword,
      sort,
      hasPublished
    }
  })
  return response.data
}
