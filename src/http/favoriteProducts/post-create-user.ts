interface PostCreateUserRequest {
  username: string
  email: string
  password: string
}

export async function PostCreateUser({ username, email, password }: PostCreateUserRequest) {
  const res = await fetch(process.env.NEXT_PUBLIC_FAVORITE_PRODUCTS_API_URL + '/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })

  return res.status
}