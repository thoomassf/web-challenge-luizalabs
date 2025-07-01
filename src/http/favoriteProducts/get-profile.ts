import api from "@/lib/axios"

interface GetProfileResponse {
  user: {
    id: string
    username: string
    email: string
    created_at: string
  }
}

export async function GetProfile() {
  const response = await api.get('/me')

  const data: GetProfileResponse = response.data

  return data
}