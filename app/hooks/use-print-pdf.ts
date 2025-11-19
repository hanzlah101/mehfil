import { pdf } from "@react-pdf/renderer"
import { useMutation } from "@tanstack/react-query"

export function usePrintPDF() {
  const { mutate: printPDF, isPending: isPrinting } = useMutation({
    mutationFn: async (pdfComponent: React.JSX.Element) => {
      const blob = await pdf(pdfComponent).toBlob()

      const url = URL.createObjectURL(blob)

      const iframe = document.createElement("iframe")
      iframe.style.position = "fixed"
      iframe.style.right = "0"
      iframe.style.bottom = "0"
      iframe.style.width = "0"
      iframe.style.height = "0"
      iframe.style.border = "0"

      document.body.appendChild(iframe)

      await new Promise<void>((resolve, reject) => {
        iframe.onload = () => {
          setTimeout(() => {
            try {
              if (iframe.contentWindow) {
                iframe.contentWindow.focus()
                iframe.contentWindow.print()

                iframe.contentWindow.addEventListener("afterprint", () => {
                  if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe)
                  }
                  URL.revokeObjectURL(url)
                })

                resolve()
              } else {
                reject(new Error("Cannot access iframe content"))
              }
            } catch (error) {
              reject(error)
            }
          }, 500)
        }
        iframe.onerror = () => reject(new Error("Failed to load PDF"))

        iframe.src = url
      })

      return url
    }
  })

  return { printPDF, isPrinting }
}
