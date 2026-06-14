import React from 'react'
import type { UserType } from '../types/auth.types'
import { sendReadMessage } from '../services/websocket'
const Sidebar = ({ userList, setOpened, onlineList, unreadCount, setUnreadCount }: {
  userList: UserType[],
  setOpened: React.Dispatch<React.SetStateAction<UserType | null>>,
  onlineList: Set<string>,
  unreadCount: Record<string, number>,
  setUnreadCount: React.Dispatch<React.SetStateAction<Record<string, number>>>

}) => {
  return (<div className="w-72 bg-white border-r h-[calc(100vh-4rem)] overflow-y-auto">
    <div className="p-4 border-b text-xl font-semibold">
      Users
    </div>

    {userList.map((user) => {
      return (
        <div
          key={user.id}
          onClick={() => {
            setOpened(user);
            sendReadMessage(user.id);
            setUnreadCount(prev => ({
              ...prev,
              [user.id]: 0
            }));
          }}
          className={onlineList.has(user.id) ? "border border-8 border-green-600 px-5 py-4 border-b cursor-pointer hover:bg-slate-100 transition" : "border border-8 border-red-500 px-5 py-4 border-b cursor-pointer hover:bg-slate-100 transition"}
        >
          {user.email.split('@')[0]}
          {
            unreadCount[user.id] > 0 &&
            <>
              <br />
              <span>
                {
                  unreadCount[user.id]
                }
              </span>
            </>
          }
        </div>
      )
    })}

  </div>

  )
}

export default Sidebar
