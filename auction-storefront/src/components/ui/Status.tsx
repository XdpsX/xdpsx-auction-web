import React, { forwardRef, memo } from 'react'

import CircleSvgIcon from './CircleSvgIcon'
import { statusColorMap, StatusOptions } from '../../utils/data'
import Popover from './Popover'

export interface StatusProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
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
        <Popover renderPopover={content} placement="bottom">
          <div
            ref={forwardedRef}
            className={`flex w-fit items-center gap-[2px] border border-gray-200 rounded-md bg-gray-50 shadow-sm p-1 ${className}`}
          >
            <CircleSvgIcon color={statusColor} />
            <span className="px-1 text-default-800">{status}</span>
          </div>
        </Popover>
      )
    }
    return (
      <div
        ref={forwardedRef}
        className={`flex w-fit items-center gap-[2px] border border-gray-200 rounded-md bg-gray-50 shadow-sm px-2 py-1 ${className}`}
      >
        <CircleSvgIcon color={statusColor} />
        <span className="px-1 text-default-800">{status}</span>
      </div>
    )
  })
)

Status.displayName = 'Status'
