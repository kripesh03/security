import { BsInfoCircleFill } from 'react-icons/bs'

const PersistLoginAlert = ({ maxWidth, marginAuto }) => {
  return (
    <div
      className="bg-blue-50 mt-3 border border-blue-300 text-blue-700 p-4 rounded-lg text-sm"
      style={{ maxWidth, margin: marginAuto ? '0 auto' : undefined }}
      role="alert"
    >
      <div className="flex items-center mb-2">
        <BsInfoCircleFill className="text-blue-500 mr-2" />
        <strong>Info:</strong>
      </div>
      <ul className="list-disc list-inside space-y-1 pl-1">
        <li>
          Choosing <strong>"Keep me logged in"</strong> reduces the number of
          times you're asked to log in on this device.
        </li>
        <li>
          To keep your account secure, use this option only on{' '}
          <strong>Trusted Devices</strong>.
        </li>
      </ul>
    </div>
  )
}

export default PersistLoginAlert
