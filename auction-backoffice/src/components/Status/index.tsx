import React, { forwardRef, memo } from 'react'
import { cn, Tooltip } from '@nextui-org/react'

import { statusColorMap, type StatusOptions } from '~/utils/data'
import CircleIcon from '../CircleIcon'

export interface StatusProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  className?: string
  status: StatusOptions
  content?: string | React.ReactNode
}

export const Status = memo(
  forwardRef<HTMLDivElement, StatusProps>((props, forwardedRef) => {
    const { className, status, content } = props
    const statusColor = statusColorMap[status]
    if (content) {
      return (
        <Tooltip content={content}>
          <div
            ref={forwardedRef}
            className={cn('flex w-fit items-center gap-[2px] rounded-lg bg-default-100 px-2 py-1', className)}
          >
            <CircleIcon color={statusColor} />
            <span className='px-1 text-default-800'>{status}</span>
          </div>
        </Tooltip>
      )
    }
    return (
      <div
        ref={forwardedRef}
        className={cn('flex w-fit items-center gap-[2px] rounded-lg bg-default-100 px-2 py-1', className)}
      >
        <CircleIcon color={statusColor} />
        <span className='px-1 text-default-800'>{status}</span>
      </div>
    )
  })
)

Status.displayName = 'Status'
