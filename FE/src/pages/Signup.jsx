import SignupForm from "../components/signup-form"
import { PageContainer } from "@/components/Layout"
export default function Signup() {
  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </PageContainer>
  )
}
