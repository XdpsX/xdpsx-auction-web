import Stats from './Stats'
import AuctionTypeChart from './AuctionTypeChart'
import RevenueChart from './RevenueChart'

function Dashboard() {
  return (
    <div className='px-6 space-y-24'>
      <Stats />
      <section className='bg-white h-[250px] flex gap-20'>
        <div className='w-[60%]'>
          <h3 className='font-semibold text-xl text-default-500 mb-4'>12-Month Revenue</h3>
          <RevenueChart />
        </div>
        <div className='w-[30%]'>
          <h3 className='font-semibold text-xl text-default-500 mb-4'>Auction Type</h3>
          <AuctionTypeChart />
        </div>
      </section>
    </div>
  )
}
export default Dashboard
