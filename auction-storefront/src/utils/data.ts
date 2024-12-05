import { SelectOptionType } from '../components/ui/Select'

export const statusOptions = [
  { name: 'Upcoming', uid: 'upcoming' },
  { name: 'Live', uid: 'live' },
  { name: 'Ending soon', uid: 'endingSoon' },
  { name: 'Ended', uid: 'ended' },
] as const

export type StatusOptions = (typeof statusOptions)[number]['name']

export const statusColorMap: Record<StatusOptions, string> = {
  Upcoming: 'currentColor',
  Live: '#17C964',
  'Ending soon': '#F5A524',
  Ended: '#F31260',
}

export const bidSortOptions: SelectOptionType[] = [
  { title: 'Newest', key: '-date' },
  { title: 'Oldest', key: 'date' },
  { title: 'Amount 9-0', key: '-amount' },
  { title: 'Amount 0-9', key: 'amount' },
]
export const orderSortOptions: SelectOptionType[] = bidSortOptions
export const transactionSortOptions: SelectOptionType[] = bidSortOptions
export const withdrawSortOptions: SelectOptionType[] = bidSortOptions

export const pageNumOptions: SelectOptionType[] = [
  { key: '5', title: '5' },
  { key: '10', title: '10' },
  { key: '20', title: '20' },
]

export const withdrawStatusOptions: SelectOptionType[] = [
  { title: 'All', key: 'all' },
  { title: 'Pending', key: '0' },
  { title: 'Confirmed', key: '1' },
  { title: 'Completed', key: '2' },
  { title: 'Rejected', key: '3' },
  { title: 'Cancelled', key: '4' },
]

export const bankList = [
  'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
  'Ngân hàng TMCP Công thương Việt Nam (VietinBank)',
  'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
  'Ngân hàng TMCP Á Châu (ACB)',
  'Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)',
  'Ngân hàng TMCP Quân đội (MB Bank)',
  'Ngân hàng TMCP Phát triển TP.HCM (HDBank)',
  'Ngân hàng TMCP Quốc tế Việt Nam (VIB)',
  'Ngân hàng TMCP Tiên Phong (TPBank)',
  'Ngân hàng TMCP Bắc Á (Bac A Bank)',
]

export const vnpayCodes = [
  { code: '00', message: 'Transaction successful', status: 'success' },
  {
    code: '07',
    message:
      'Transaction successful. Transaction is suspected (related to fraud, unusual transaction).',
    status: 'failure',
  },
  {
    code: '09',
    message:
      "Transaction failed: Customer's card/account has not registered for Internet Banking service at the bank.",
    status: 'failure',
  },
  {
    code: '10',
    message:
      'Transaction failed: Customer has entered incorrect card/account information more than 3 times.',
    status: 'failure',
  },
  {
    code: '11',
    message:
      'Transaction failed: Payment timeout has expired. Please try the transaction again.',
    status: 'failure',
  },
  {
    code: '12',
    message: "Transaction failed: Customer's card/account is locked.",
    status: 'failure',
  },
  {
    code: '13',
    message:
      'Transaction failed: Customer entered the transaction authentication password (OTP) incorrectly. Please try the transaction again.',
    status: 'failure',
  },
  {
    code: '24',
    message: 'Transaction failed: Customer canceled the transaction.',
    status: 'failure',
  },
  {
    code: '51',
    message:
      'Transaction failed: Your account does not have enough balance to perform the transaction.',
    status: 'failure',
  },
  {
    code: '65',
    message:
      'Transaction failed: Your account has exceeded the daily transaction limit.',
    status: 'failure',
  },
  {
    code: '75',
    message: 'The payment bank is under maintenance.',
    status: 'failure',
  },
  {
    code: '79',
    message:
      'Transaction failed: Customer entered the payment password incorrectly more than the allowed number of times. Please try the transaction again.',
    status: 'failure',
  },
  {
    code: '99',
    message:
      'Other errors (remaining errors not listed in the error code list provided).',
    status: 'failure',
  },
]

// export type BankType = { id: number; name: string; abbr: string }
// export const bankList: BankType[] = [
//   {
//     id: 1,
//     name: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
//     abbr: 'Vietcombank',
//   },
//   {
//     id: 2,
//     name: 'Ngân hàng TMCP Công thương Việt Nam (VietinBank)',
//     abbr: 'VietinBank',
//   },
//   {
//     id: 3,
//     name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
//     abbr: 'BIDV',
//   },
//   { id: 4, name: 'Ngân hàng TMCP Á Châu (ACB)', abbr: 'ACB' },
//   {
//     id: 5,
//     name: 'Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)',
//     abbr: 'Sacombank',
//   },
//   { id: 6, name: 'Ngân hàng TMCP Quân đội (MB Bank)', abbr: 'MB Bank' },
//   { id: 7, name: 'Ngân hàng TMCP Phát triển TP.HCM (HDBank)', abbr: 'HDBank' },
//   { id: 8, name: 'Ngân hàng TMCP Quốc tế Việt Nam (VIB)', abbr: 'VIB' },
//   { id: 9, name: 'Ngân hàng TMCP Tiên Phong (TPBank)', abbr: 'TPBank' },
//   { id: 10, name: 'Ngân hàng TMCP Bắc Á (Bac A Bank)', abbr: 'Bac A Bank' },
//   { id: 11, name: 'Ngân hàng TMCP Đông Á (DongA Bank)', abbr: 'DongA Bank' },
//   { id: 12, name: 'Ngân hàng TMCP Nam Á (Nam A Bank)', abbr: 'Nam A Bank' },
//   { id: 13, name: 'Ngân hàng TMCP Phương Đông (OCB)', abbr: 'OCB' },
//   { id: 14, name: 'Ngân hàng TMCP Quốc dân (NCB)', abbr: 'NCB' },
//   {
//     id: 15,
//     name: 'Ngân hàng TMCP Bản Việt (Viet Capital Bank)',
//     abbr: 'Viet Capital Bank',
//   },
//   { id: 16, name: 'Ngân hàng TMCP Sài Gòn (SCB)', abbr: 'SCB' },
//   {
//     id: 17,
//     name: 'Ngân hàng TMCP Kiên Long (Kien Long Bank)',
//     abbr: 'Kien Long Bank',
//   },
//   {
//     id: 18,
//     name: 'Ngân hàng TMCP Hàng Hải Việt Nam (Maritime Bank)',
//     abbr: 'Maritime Bank',
//   },
//   {
//     id: 19,
//     name: 'Ngân hàng TMCP Bưu điện Liên Việt (LienVietPostBank)',
//     abbr: 'LienVietPostBank',
//   },
//   { id: 20, name: 'Ngân hàng TMCP Việt Á (Viet A Bank)', abbr: 'Viet A Bank' },
// ]
