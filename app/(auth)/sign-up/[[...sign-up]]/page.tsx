"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '/lib/auth-client'
import Link from 'next/link'
import { Button } from '/components/ui/button'
import { Input } from '/components/ui/input'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name,
    })

    if (signUpError) {
      setError(signUpError.message || 'Failed to sign up')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const handleGoogle = async () => {
    await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' })
  }

  return (
    <section className="">
      <img
        alt=""
        src="/Finance.jpg"
        className="absolute inset-0 h-full w-full object-cover blur-xs"
      />
      <div className="flex place-content-center justify-center items-center flex-col h-screen">
        <div className="bg-white dark:bg-[#1B1B1F] p-8 rounded-lg shadow-lg w-full max-w-md z-10">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full hover:bg-[#107c73]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="mx-3 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <Button
            type="button"
            onClick={handleGoogle}
            variant="outline"
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <p className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
