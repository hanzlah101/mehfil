import { Activity, useState } from "react"
import { UpdateBillForm } from "./update-bill-form"
import { PrintBill } from "./print-bill"

export function EventBill() {
  const [step, setStep] = useState(1)

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
