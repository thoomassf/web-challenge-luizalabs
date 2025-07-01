interface LoginRequest {
  email: string
  password: string
}

export async function login({ email, password }: LoginRequest) {
  const res = await fetch(process.env.NEXT_PUBLIC_FAVORITE_PRODUCTS_API_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const statusResponse = res.status
  const dataResponse = await res.json()

  return {
    status: statusResponse,
    response: dataResponse,
  }
}