import { Category } from '../../models/category.type'
import api from '../../utils/api'

export const getListCategoriesAPI = async () => {
  const response = await api.get<Category[]>('/public/categories')
  return response.data
}
