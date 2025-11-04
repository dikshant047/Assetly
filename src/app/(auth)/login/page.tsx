import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginWrapper } from "./LoginWrapper";

export default async function LoginPage() {
  const session = await auth();

  // Redirect if already logged in
  if (session?.user) {
    const redirectUrl = session.user.role === "ADMIN" ? "/admin" : "/investor";
    redirect(redirectUrl);
  }

  return <LoginWrapper />;
}