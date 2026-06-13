import React from 'react'
import type { UserType } from '../types/auth.types'

const Sidebar = ({ userList, setOpened, onlineList }: {
  userList: UserType[],
  setOpened: React.Dispatch<React.SetStateAction<UserType | null>>,
  onlineList: Set<string>,
}) => {
  return (<div className="w-72 bg-white border-r h-[calc(100vh-4rem)] overflow-y-auto">
    <div className="p-4 border-b text-xl font-semibold">
      Users
    </div>

    {userList.map((user) => {
      return (
        <div
          key={user.id}
          onClick={() => setOpened(user)}
          className={onlineList.has(user.id) ? "border border-8 border-green-600 px-5 py-4 border-b cursor-pointer hover:bg-slate-100 transition" : "border border-8 border-red-500 px-5 py-4 border-b cursor-pointer hover:bg-slate-100 transition"}
        >
          {user.email.split('@')[0]}
        </div>
      )
    })}

  </div>

  )
}

export default Sidebar
