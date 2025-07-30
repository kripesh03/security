import { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Audit = () => {
  const [logs, setLogs] = useState([])
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosPrivate.get('/api/audit-logs')
        setLogs(res.data)
      } catch (err) {
        console.error('Error fetching logs:', err)
      }
    }

    fetchLogs()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Audit Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="px-4 py-2 border-b">Time</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Method</th>
              <th className="px-4 py-2 border-b">URL</th>
              <th className="px-4 py-2 border-b">IP</th>
              {/* <th className="px-4 py-2 border-b">User Agent</th> */}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="text-sm">
                <td className="px-4 py-2 border-b">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{log.email}</td>
                <td className="px-4 py-2 border-b">{log.method}</td>
                <td className="px-4 py-2 border-b">{log.url}</td>
                <td className="px-4 py-2 border-b">{log.ip}</td>
                {/* <td className="px-4 py-2 border-b truncate">{log.userAgent}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Audit
