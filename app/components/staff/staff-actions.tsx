import { RiMoreFill, RiEdit2Line, RiDeleteBinLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Protected } from "@/components/protected"
import { useStaffModal } from "@/stores/use-staff-modal"
import type { StaffMember } from "./staff-table-columns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface StaffActionsProps {
  staff: StaffMember
}

export function StaffActions({ staff }: StaffActionsProps) {
  const openStaffModal = useStaffModal((s) => s.onOpen)

  return (
    <Protected perm={["update:staff", "delete:staff"]} operator="or">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="data-[state=open]:bg-accent"
          >
            <RiMoreFill className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Protected perm="update:staff">
            <DropdownMenuItem onClick={() => openStaffModal("update", staff)}>
              <RiEdit2Line />
              Edit Staff
            </DropdownMenuItem>
          </Protected>

          <Protected perm="delete:staff">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => openStaffModal("delete", staff)}
            >
              <RiDeleteBinLine />
              Delete Staff
            </DropdownMenuItem>
          </Protected>
        </DropdownMenuContent>
      </DropdownMenu>
    </Protected>
  )
}
