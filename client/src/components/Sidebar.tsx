import React from 'react'
import type { UserType } from '../types/auth.types'

const Sidebar = ({ userList, setOpened }: {
  userList: UserType[], setOpened: React.Dispatch<React.SetStateAction<UserType | null>>
}) => {
  return (
    <div>
      {userList.map((user) => {
        return (<div key={user.id
        } onClick={() => setOpened(user)}>
          {user.email}
        </div>)
      })}
    </div>
  )
}

export default Sidebar