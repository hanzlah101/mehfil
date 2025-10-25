import { AuthWrapper } from "@/components/auth-wrapper"

export function meta() {
  return [{ title: "Calendar" }, { name: "description", content: "Calendar" }]
}

export default function Home() {
  return <AuthWrapper></AuthWrapper>
}
