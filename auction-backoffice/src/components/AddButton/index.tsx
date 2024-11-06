import { Icon } from '@iconify/react'
import { cn } from '@nextui-org/react'
import { Link } from 'react-router-dom'

function AddButton({ to = 'add', className }: { to?: string; className?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-md text-white bg-primary-500 hover:bg-primary-600 transition-colors',
        className
      )}
    >
      Add New
      <Icon icon='solar:add-circle-bold' width={20} />
    </Link>
  )
}
export default AddButton
