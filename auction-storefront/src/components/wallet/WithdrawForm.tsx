import { useState } from 'react'
import {
  createWithdrawRequestSchema,
  WithdrawPayload,
  WithdrawStatusParam,
} from '../../models/wallet.type'
import { bankList } from '../../utils/data'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from '../ui/Input'
import Button from '../ui/Button'
import useQueryParams from '../../hooks/useQueryParams'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createWithdrawAsync,
  fetchMyWithdrawalsAsync,
  selectWallet,
} from '../../features/wallet/slice'
import { toast } from 'react-toastify'

function WithdrawForm() {
  const dispatch = useAppDispatch()
  const {
    params: { pageNum, pageSize, sort, withdrawStatus: status },
    deleteAllParams,
  } = useQueryParams()
  const { wallet, isCreatingWithdraw: isLoading } = useAppSelector(selectWallet)
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createWithdrawRequestSchema(wallet?.balance)),
    defaultValues: {
      bankName: '',
      amount: 50_000,
      holderName: '',
      accountNumber: '',
    },
  })

  const [bankNameInput, setBankNameInput] = useState('')
  const [filteredBanks, setFilteredBanks] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)

  const handleBankNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value) {
      clearErrors('bankName')
    }
    setBankNameInput(value)
    setValue('bankName', value)

    if (value) {
      const filtered = bankList.filter((bank) =>
        bank.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredBanks(filtered)
    } else {
      setFilteredBanks([])
    }
  }

  const handleBankNameSelect = (bank: string) => {
    clearErrors('bankName')
    setBankNameInput(bank)
    setValue('bankName', bank)
    setFilteredBanks([])
  }

  const onSubmit = async (data: WithdrawPayload) => {
    dispatch(createWithdrawAsync(data))
      .unwrap()
      .then(() => {
        toast.success('Withdrawal request has been submitted')
        deleteAllParams()
        reset()
        setBankNameInput('')
        dispatch(
          fetchMyWithdrawalsAsync({
            pageNum: Number(pageNum),
            pageSize: Number(pageSize),
            sort,
            status:
              status === 'all' ? null : (Number(status) as WithdrawStatusParam),
          })
        )
      })
      .catch((err) => {
        console.log(err)
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((key) => {
            setError(key as keyof WithdrawPayload, {
              type: 'manual',
              message: err.fieldErrors[key],
            })
          })
        }
      })
  }

  return (
    <form
      className="mt-8 flex flex-col-reverse md:flex-row md:items-start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mt-6 flex-grow md:mt-0 md:pr-12">
        <div className="flex flex-col flex-wrap sm:flex-row">
          <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
            Bank Name:
          </div>
          <div className="relative sm:w-[80%] sm:pl-5">
            <Input
              classNameInput="w-full rounded-sm border border-gray-300 pr-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
              name="bankName"
              type="text"
              value={bankNameInput}
              onChange={handleBankNameChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              error={errors.bankName}
              control={control}
              autoComplete="off"
            />
            {isFocused && filteredBanks.length > 0 && (
              <ul className="absolute z-[99] mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {filteredBanks.map((bank, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onMouseDown={() => handleBankNameSelect(bank)}
                  >
                    {bank}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-8 flex flex-col flex-wrap sm:flex-row">
          <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
            Account Number:
          </div>
          <div className="sm:w-[80%] sm:pl-5">
            <Input
              classNameInput="w-full rounded-sm border border-gray-300 pr-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
              name="accountNumber"
              type="text"
              error={errors.accountNumber}
              control={control}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col flex-wrap sm:flex-row">
          <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
            Holder Name:
          </div>
          <div className="sm:w-[80%] sm:pl-5">
            <Input
              classNameInput="w-full rounded-sm border border-gray-300 pr-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
              name="holderName"
              type="text"
              error={errors.holderName}
              control={control}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col flex-wrap sm:flex-row">
          <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
            Amount:
          </div>
          <div className="sm:w-[80%] relative sm:pl-5">
            <Input
              classNameInput="w-full  rounded-sm border border-gray-300 pr-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
              name="amount"
              type="number"
              min={50_000}
              step={10_000}
              error={errors.amount}
              control={control}
            />
            <button
              onClick={() => {
                if (wallet) setValue('amount', wallet.balance)
              }}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200 text-gray-600 rounded-sm px-2 py-1 hover:bg-gray-300"
            >
              Max
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
          <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
          <div className="sm:w-[80%] sm:pl-5">
            <Button
              disabled={isLoading}
              className="bg-blue-500 min-w-20"
              type="submit"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
export default WithdrawForm
