import React from 'react'

const PersistLoginCheckbox = ({ persist, setPersist, className = '', bold }) => {
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-700 ${className}`}>
      <input
        id="persist"
        type="checkbox"
        checked={persist}
        onChange={() => setPersist(prev => !prev)}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
      />
      <label htmlFor="persist" className="cursor-pointer">
        {bold ? <strong>Keep me logged in</strong> : 'Keep me logged in'}
      </label>
    </div>
  )
}

export default PersistLoginCheckbox
