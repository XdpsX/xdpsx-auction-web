import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

function ChangePasswordPage() {
  return (
    <div className="rounded-sm bg-white border px-2 pb-10 shadow md:px-7 md:pb-20">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Password
        </h1>
        <div className="mt-1 text-sm text-gray-700">Change your password</div>
      </div>

      <form
        className="mt-8 flex flex-col-reverse md:flex-row md:items-start"
        // onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-6 flex-grow md:mt-0 md:pr-12">
          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Current Password
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                name="name"
                // error={errors.name}
                // control={control}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              New Password
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                name="mobileNumber"
                // error={errors.mobileNumber}
                // control={control}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Confirm Password
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                name="address"
                // error={errors.address}
                // control={control}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
            <div className="sm:w-[80%] sm:pl-5">
              <Button
                // disabled={isLoading}
                className="bg-blue-500 min-w-20"
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
export default ChangePasswordPage
