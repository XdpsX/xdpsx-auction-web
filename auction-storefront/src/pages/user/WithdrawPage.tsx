import WithdrawForm from '../../components/wallet/WithdrawForm'
import Withdraws from '../../components/wallet/Withdraws'

function WithdrawPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-sm bg-white px-2 pb-8 shadow border md:px-7 md:pb-14">
        <div className="border-b border-b-gray-200 py-6">
          <h1 className="text-lg font-medium capitalize text-gray-900">
            Withdraw
          </h1>
          <div className="mt-1 text-sm text-gray-700">
            Manage your withdraw requests
          </div>
        </div>
        <WithdrawForm />
      </section>
      <section className="rounded-sm bg-white px-2 py-8 shadow border md:px-7 md:py-14">
        <Withdraws />
      </section>
    </div>
  )
}
export default WithdrawPage
