import React from 'react'
import type { UserType } from '../types/auth.types'

const Sidebar = ({ userList, setOpened }: {
  userList: UserType[], setOpened: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  return (
    <div>
      {userList.map((user) => {
        return (<div key={user.id
        } onClick={() => setOpened(user.id)}>
          {user.email}
        </div>)
      })}
    </div>
  )
}

export default Sidebar