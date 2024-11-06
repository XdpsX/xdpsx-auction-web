import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'

const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export default useAppDispatch
