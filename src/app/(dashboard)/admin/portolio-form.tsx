"use client"

import { useActionState } from "react"  // ← Changed
import{ updatePortfolioValue } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export function PortfolioUpdateForm(){

    const[ state, formAction] = useActionState(updatePortfolioValue, undefined)

    return(
        <form action={formAction} className="space-y-4">
            {state?.message && (
                <div className= " p-3 text-sm bg-primary/10 text-primary rounded-md">
                    {state.message}

                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="newValue">New Portfolio Value</Label>
                <Input
                    id="newValue"
                    name="Value"
                    type="number"
                    step ="0.01"
                    placeholder="0.00"
                    required
                    />
                    </div>
                    <Button type="submit"  >
                         Update Value
                    </Button>
        </form>
    )


}