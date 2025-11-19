import { Activity, useEffect, useMemo, useState } from "react"
import { UpdateBillForm } from "./update-bill-form"
import { PrintBill } from "./print-bill"
import { useSession } from "@/hooks/use-session"

export function EventBill() {
  const { can } = useSession()

  const canEditBill = useMemo(() => can("update:event"), [can])
  const [step, setStep] = useState(canEditBill ? 1 : 2)

  useEffect(() => {
    if (!canEditBill && step === 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(1)
    }
  }, [canEditBill, step])

  return (
    <>
      <Activity mode={step === 1 ? "visible" : "hidden"}>
        <UpdateBillForm onContinue={() => setStep(2)} />
      </Activity>
      <Activity mode={step === 2 ? "visible" : "hidden"}>
        <PrintBill onBack={() => setStep(1)} />
      </Activity>
    </>
  )
}
