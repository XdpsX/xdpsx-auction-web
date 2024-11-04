import { Icon } from '@iconify/react'
import Chart, { Props } from 'react-apexcharts'
function Dashboard() {
  const state: Props['series'] = [
    {
      name: 'Series1',
      data: [31, 40, 28, 51, 42, 109, 100]
    },
    {
      name: 'Series2',
      data: [11, 32, 45, 32, 34, 52, 41]
    }
  ]

  const options: Props['options'] = {
    chart: {
      type: 'area',
      animations: {
        speed: 300
      },
      sparkline: {
        enabled: false
      },
      brush: {
        enabled: false
      },
      id: 'basic-bar',
      fontFamily: 'Inter, sans-serif',
      foreColor: 'var(--nextui-colors-accents9)',
      stacked: true,
      toolbar: {
        show: false
      }
    },

    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      labels: {
        // show: false,
        style: {
          colors: 'var(--nextui-colors-accents8)',
          fontFamily: 'Inter, sans-serif'
        }
      },
      axisBorder: {
        color: 'var(--nextui-colors-border)'
      },
      axisTicks: {
        color: 'var(--nextui-colors-border)'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--nextui-colors-accents8)',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      enabled: false
    },
    grid: {
      show: true,
      borderColor: 'var(--nextui-colors-border)',
      strokeDashArray: 0,
      position: 'back'
    },
    stroke: {
      curve: 'smooth',
      fill: {
        colors: ['red']
      }
    },
    markers: {
      size: 0
    }
  }
  return (
    <div>
      <section className='flex py-2 justify-between gap-8'>
        <div className='flex-1 p-4 flex items-center gap-6 bg-white shadow-sm'>
          <div className='h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center'>
            <Icon icon='solar:sledgehammer-outline' className='h-8 w-8 text-blue-500' />
          </div>
          <div>
            <p className='text-xl text-slate-700 font-bold'>178+</p>
            <h4 className='text-foreground tracking-tight'>Auctions</h4>
          </div>
        </div>
        <div className='flex-1 p-4 flex items-center gap-6 bg-white shadow-sm'>
          <div className='h-14 w-14 bg-orange-50 rounded-full flex items-center justify-center'>
            <Icon icon='solar:sledgehammer-outline' className='h-8 w-8 text-orange-500' />
          </div>
          <div>
            <p className='text-xl text-slate-700 font-bold'>178+</p>
            <h4 className='text-foreground tracking-tight'>Auctions</h4>
          </div>
        </div>
        <div className='flex-1 p-4 flex items-center gap-6 bg-white shadow-sm'>
          <div className='h-14 w-14 bg-yellow-50 rounded-full flex items-center justify-center'>
            <Icon icon='solar:sledgehammer-outline' className='h-8 w-8 text-yellow-500' />
          </div>
          <div>
            <p className='text-xl text-slate-700 font-bold'>178+</p>
            <h4 className='text-foreground tracking-tight'>Auctions</h4>
          </div>
        </div>
        <div className='flex-1 p-4 flex items-center gap-6 bg-white shadow-sm'>
          <div className='h-14 w-14 bg-purple-50 rounded-full flex items-center justify-center'>
            <Icon icon='solar:sledgehammer-outline' className='h-8 w-8 text-purple-500' />
          </div>
          <div>
            <p className='text-xl text-slate-700 font-bold'>178+</p>
            <h4 className='text-foreground tracking-tight'>Auctions</h4>
          </div>
        </div>
      </section>
      <section className='py-2'>
        <Chart options={options} series={state} type='area' height={425} />
      </section>
    </div>
  )
}
export default Dashboard
