import React from 'react'
import type { UserType } from '../types/auth.types'

const Sidebar = ({ userList, setOpened }: {
userList: UserType[], setOpened: React.Dispatch<React.SetStateAction<UserType | null>>
}) => {
return ( <div className="w-72 bg-white border-r h-[calc(100vh-4rem)] overflow-y-auto">
  <div className="p-4 border-b text-xl font-semibold">
    Users
  </div>

  {userList.map((user) => {
    return (
      <div
        key={user.id}
        onClick={() => setOpened(user)}
        className="px-5 py-4 border-b cursor-pointer hover:bg-slate-100 transition"
      >
        {user.email}
      </div>
    )
  })}

</div>

)
}

export default Sidebar
