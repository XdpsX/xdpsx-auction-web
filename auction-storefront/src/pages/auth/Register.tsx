import { useState } from 'react'
import RegisterForm from '../../components/auth/RegisterForm'
import { CREATE_ACCOUNT_STEP, REGISTER_STEP } from '../../constants/steps'
import CreateAccountForm from '../../components/auth/CreateAccountForm'

function Register() {
  const [currentStep, setCurrentStep] = useState(REGISTER_STEP)

  return (
    <div
      className={` relative overflow-hidden min-h-[530px] w-[380px] lg:w-[420px]`}
    >
      <div
        className={`w-full absolute flex items-center justify-center h-full top-0 left-0 transition-transform duration-500 ${
          currentStep !== CREATE_ACCOUNT_STEP
            ? 'translate-x-0'
            : '-translate-x-[150%]'
        }`}
      >
        <RegisterForm setCurrentStep={setCurrentStep} />
      </div>
      <div
        className={`w-full absolute flex items-center justify-center h-full top-0 left-0 transition-transform duration-500 ${
          currentStep !== CREATE_ACCOUNT_STEP
            ? 'translate-x-[150%]'
            : 'translate-x-0'
        }`}
      >
        <CreateAccountForm setCurrentStep={setCurrentStep} />
      </div>
    </div>
  )
}
export default Register
