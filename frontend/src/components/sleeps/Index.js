
import { BsCalendarWeek } from 'react-icons/bs'
import Edit from './Edit'
import Delete from './Delete'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
const moment = require('moment')

const Index = ({ sleep }) => {
const sleepTime = sleep.sleep.replace('T', ' ')
const wakeTime = sleep.wake.replace('T', ' ')

const durationCoverter = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours} Hours ${minutes} minutes`
}

  return (
    <div className="col-md-4">
    <div className="card mb-3">
        <div className="card-body d-flex justify-content-between">
            <div>
                <div className="d-inline-flex align-items-center fs-4 text-primary "><BsCalendarWeek/>&nbsp;{moment(sleep.sleep.split('T').shift()).format('DD-MM-YYYY dddd')}</div>
                <p>
                    <strong className="fs-6 text-muted">Sleep Time:</strong>&ensp;{sleepTime}<br/>
                    <strong className="fs-6 text-muted">Wake Time:</strong>&ensp;{wakeTime}<br/>
                    <strong className="fs-6 text-muted">Duration:</strong>&ensp;{durationCoverter(sleep.duration)}<br/>
                    {formatDistanceToNow(new Date(sleep.createdAt), { addSuffix: true })}
                </p>
            </div>
            <div>
                <Edit sleep={sleep}/>
                <Delete sleep={sleep}/>
            </div>
        </div>
    </div>
    </div>
  )
}
  
export default Index

