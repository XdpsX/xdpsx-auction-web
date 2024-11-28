import PulseLoader from 'react-spinners/PulseLoader'

function LoadingOverlay({
  children = <PulseLoader color="#3b82f6" />,
}: {
  children?: React.ReactNode
}) {
  return (
    <>
      <div className="absolute top-0 left-0 z-10 w-full h-full bg-white opacity-50"></div>
      <div className="absolute top-1/2 right-1/2 z-20 translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </>
  )
}
export default LoadingOverlay
