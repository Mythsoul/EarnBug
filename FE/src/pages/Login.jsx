import LoginForm from "../components/login-form"
import { PageContainer } from "@/components/Layout"
export default function Login() {
  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </PageContainer>
  )
}
