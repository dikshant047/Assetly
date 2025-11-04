"use client"

import { useActionState } from "react"; // ← Changed
import { createInvestor } from "./actions";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
 

export function AddInvestorForm(){
    const[ state, formAction] = useActionState(createInvestor, undefined)

    return(
        <form action = {formAction} className="space-y-4">
            {state?.message && (
                <div className= " p-3 text-sm bg-primary/10 text-primary rounded-md">
                    {state.message}

                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="investorName"> New Investor Name</Label>
                <Input
                    id="investorName"
                    name="name"
                    type="text"
                    placeholder="dishu "
                    required
                    />
            </div>
            <div className="space-y-2">
                <Label htmlFor="investorEmail"> New Investor Email</Label>
                <Input
                    id="investorEmail"
                    name="email"
                    type="email"
                    placeholder=" dishu07@email.com"
                    required
                    />
            </div>
            <div className="space-y-2">
                <Label htmlFor="investorPassword">Investor password</Label>  
                <Input
                    id="investorPassword"
                    name="password"
                    type="password"
                    placeholder="******"
                    required
                    />
                 </div>

            <Button type="submit"  >
                 Add Investor
            </Button>
        </form>
    )
}