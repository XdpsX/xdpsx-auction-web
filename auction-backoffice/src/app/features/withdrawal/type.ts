export type WithdrawStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'
export type Withdraw = {
  id: number
  bankName: string
  accountNumber: string
  holderName: string
  amount: number
  status: WithdrawStatus
  reason: string | null
  updatedAt: string
}
export enum WithdrawStatusParam {
  PENDING = 0,
  CONFIRMED = 1,
  COMPLETED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export type UpdateWithdrawStatusPayload = {
  status: WithdrawStatus
  reason?: string
}
