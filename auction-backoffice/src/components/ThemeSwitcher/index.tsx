import { Icon } from '@iconify/react'
import { Button } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      {theme === 'light' ? (
        <Button isIconOnly aria-label='Dark' onClick={() => setTheme('dark')}>
          <Icon icon='solar:moon-outline' width={20} />
        </Button>
      ) : (
        <Button isIconOnly aria-label='Light' onClick={() => setTheme('light')}>
          <Icon icon='solar:sun-2-outline' width={20} />
        </Button>
      )}
    </div>
  )
}
