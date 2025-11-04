"use client"
import { useActionState } from "react"; // ← Changed
import { recordTransaction } from "./actions";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
 import { getUsersList } from "./actions";
import { useState, useEffect } from "react";

export function RecordDepositForm(){
  
  
    type User = {
  id: string
  name: string
  email: string
}
const [users, setUsers] = useState<User[]>([])

    const[ state, formAction] = useActionState(recordTransaction, undefined)
  
    useEffect(() => {
  async function fetchUsers() {
    const userList = await getUsersList()  // ✅ Calls server action
    console.log("🟡 Users:", userList)
    setUsers(userList)
  }
  fetchUsers()
}, [])
    return(
        <form action = {formAction} className="space-y-4">
            {state?.message && (
                <div className= " p-3 text-sm bg-primary/10 text-primary rounded-md">
                    {state.message}
                </div>
            )}
            <div className="space-y-2">
  <Label htmlFor="userId">Investor</Label>
  <select 
    name="userId" 
    id="userId"
    className="w-full border rounded p-2"
    required
  >
    <option value="">Select investor...</option>
    {users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name} ({user.email})
      </option>
    ))}
  </select>
</div>
<div className="space-y-2">
  <Label htmlFor="type">Transaction Type</Label>
  <select 
    name="type" 
    id="type"
    className="w-full border rounded p-2"
    required
  >
    <option value="DEPOSIT">Deposit  </option>
    <option value="WITHDRAWAL">Withdrawal  </option>
  </select>
</div>
            <div className="space-y-2">
                <Label htmlFor="Amount"> Amount</Label>
                <Input
                    id="depositAmount"
                    name="amount"
                    type="number"
                    step ="0.01"
                    placeholder="0.00"
                    required
                    />
            </div>
            <div className="space-y-2">
  <Label htmlFor="depositDate">Date</Label>
  <Input
    type="date"
    name="date"
    id="depositDate"
    defaultValue={new Date().toISOString().split('T')[0]}
    required
  />
</div>
<div className="space-y-2">
  <Label htmlFor="note">Note (optional)</Label>
  <Input
    type="text"
    name="note"
    id="note"
    placeholder="e.g., Initial investment"
  />
</div>

            <Button type="submit"  >
                 Record transaction
            </Button>
        </form>
    )

}