import { AddonModal } from "@/components/addons/addon-modal"
import { AddonsList } from "@/components/addons/addons-list"
import { DeleteAddonDialog } from "@/components/addons/delete-addon-dialog"
import { Protected } from "@/components/protected"
import { BRAND_NAME } from "@/lib/constants"

export function meta() {
  return [
    { title: `${BRAND_NAME} - Addons` },
    { name: "description", content: "Create and manage addons and pricing" }
  ]
}

export default function Addons() {
  return (
    <Protected perm="read:addons">
      <AddonsList />
      <Protected operator="or" perm={["create:addon", "update:addon"]}>
        <AddonModal />
      </Protected>
      <Protected perm="delete:addon">
        <DeleteAddonDialog />
      </Protected>
    </Protected>
  )
}
