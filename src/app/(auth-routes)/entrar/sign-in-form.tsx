'use client'

import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { setCookie } from "cookies-next"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { login } from "@/http/favoriteProducts/login"
import { toast } from "sonner"
import { GetProfile } from "@/http/favoriteProducts/get-profile"
import { useUserStore } from "@/store/userStore"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type LoginData = z.infer<typeof loginSchema>

async function setClientCookie(name: string, value: string, days = 7) {
  try {
    const expires = new Date()
    expires.setDate(expires.getDate() + days)

    setCookie(name, value, {
      path: '/',
      expires,
      // Adicione `secure: true` se estiver em produção com HTTPS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}


export default function SignInForm() {
  const router = useRouter()
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const { setUserData } = useUserStore()
  
  async function handleSingIn(data: LoginData) {
    const email = data.email
    const password = data.password

    const { response, status } = await login({
      email,
      password,
    })

    if (status !== 200) {
      toast.error("Usuário ou senha inválidos")
      return
    }
    
    await setClientCookie('token', response.token)

    const { user } = await GetProfile()
    setUserData(user)

    router.push("/produtos")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Fazer Login</CardTitle>
            <p className="text-gray-600">Entre na sua conta para acessar seus favoritos</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(handleSingIn)}>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('email')}
                    type="email"
                    name="email"
                    placeholder="Digite seu email"
                    className="pl-10"
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 my-4">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('password')}
                    type="password"
                    name="password"
                    placeholder="Digite sua senha"
                    className="pl-10 pr-10"
                  />
                   {errors?.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Entrando" : "Entrar"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link href="/cadastre-se" className="text-blue-600 hover:text-blue-800 font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
