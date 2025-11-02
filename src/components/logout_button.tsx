import { signOut } from "@/lib/auth"

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
      >
        Logout
      </button>
    </form>
  )
}