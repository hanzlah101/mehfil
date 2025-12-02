import { pdf } from "@react-pdf/renderer"
import { useMutation } from "@tanstack/react-query"
import printJS from "print-js"

export function usePrintPDF() {
  const { mutate: printPDF, isPending: isPrinting } = useMutation({
    mutationFn: async (pdfComponent: React.JSX.Element) => {
      const blob = await pdf(pdfComponent).toBlob()

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(",")[1]
          resolve(base64String)
        }
        reader.readAsDataURL(blob)
      })

      await new Promise<void>((resolve) => {
        printJS({
          printable: base64,
          type: "pdf",
          base64: true,
          onLoadingEnd: () => resolve()
        })
      })
    }
  })

  return { printPDF, isPrinting }
}
