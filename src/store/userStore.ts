import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
  username: string
  email: string
  id: string
}

type UserStore = {
  userData: UserData
  setUserData: (userData: UserData) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userData: {
        username: '',
        email: '',
        id: '',
      },
      setUserData: (userData: UserData) => set({ userData }),
    }),
    {
      name: 'user-storage',
    }
  )
)