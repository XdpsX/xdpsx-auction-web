import { Category } from '~/types/category'
import { Page } from '~/types/page'
import api from '~/utils/api'

export const fetchAllCategoriesAPI = async (
  pageNum: number,
  pageSize: number,
  keyword: string | null,
  sort: string | null,
  hasPublished?: boolean | null
): Promise<Page<Category>> => {
  console.log(pageNum, pageSize, keyword, sort, hasPublished)
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
