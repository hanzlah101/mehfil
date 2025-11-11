import { createColumnHelper } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { StaffActions } from "./staff-actions"
import { SortableHeader } from "./staff-table-sortable-header"
import type { Doc } from "@db/auth/_generated/dataModel"
import {
  extractManageablePermissions,
  formatPermission
} from "@/lib/permissions"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

export type StaffMember = Doc<"user">

const columnHelper = createColumnHelper<StaffMember>()

export const staffColumns = [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <SortableHeader column={column}>Email</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email")}</div>
    )
  }),
  columnHelper.accessor("permissions", {
    header: () => <p className="text-muted-foreground">Permissions</p>,
    cell: ({ row }) => {
      const manageablePerms = extractManageablePermissions(
        row.original.permissions ?? []
      )

      if (manageablePerms.length === 0) {
        return (
          <Badge variant="secondary" className="font-normal">
            View Only
          </Badge>
        )
      }

      if (manageablePerms.length <= 2) {
        return (
          <div className="flex flex-wrap gap-1">
            {manageablePerms.map((perm) => (
              <Badge key={perm} variant="outline" className="font-normal">
                {perm.split(":")[0]}
              </Badge>
            ))}
          </div>
        )
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex cursor-pointer flex-wrap gap-1">
              {manageablePerms.slice(0, 2).map((perm) => (
                <Badge key={perm} variant="outline" className="font-normal">
                  {formatPermission(perm)}
                </Badge>
              ))}
              <Badge variant="outline" className="font-normal hover:bg-accent">
                +{manageablePerms.length - 2}
              </Badge>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto max-w-70 p-3" align="start">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                All Permissions
              </p>
              <div className="flex flex-wrap gap-1">
                {manageablePerms.map((perm) => (
                  <Badge key={perm} variant="outline" className="font-normal">
                    {formatPermission(perm)}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )
    }
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <SortableHeader column={column}>Created</SortableHeader>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className="text-muted-foreground">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })}
        </div>
      )
    }
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <StaffActions staff={row.original} />
  })
]
