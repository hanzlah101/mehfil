import * as React from "react"
import { RiAddLine, RiTeamFill } from "@remixicon/react"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { BRAND_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Protected } from "@/components/protected"
import { StaffTable } from "@/components/staff/staff-table"
import { StaffModal } from "@/components/staff/staff-modal"
import { DeleteStaffDialog } from "@/components/staff/delete-staff-dialog"
import { useStaffModal } from "@/stores/use-staff-modal"
import { PageLoader } from "@/components/page-loader"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"

export function meta() {
  return [
    { title: `${BRAND_NAME} - Staff` },
    {
      name: "description",
      content: "Manage staff members and their permissions"
    }
  ]
}

export default function Staff() {
  const openStaffModal = useStaffModal((s) => s.onOpen)

  const { data, isLoading } = useQuery(convexQuery(api.staff.list, {}))

  if (isLoading) {
    return <PageLoader className="min-h-(--content-height)" />
  }

  return (
    <>
      {data && data.length > 0 ? (
        <div className="space-y-6">
          <Header />
          <StaffTable />
        </div>
      ) : (
        <Empty className="min-h-(--content-height)">
          <EmptyHeader className="max-w-md">
            <EmptyMedia variant="icon">
              <RiTeamFill className="text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No staff members</EmptyTitle>
            <EmptyDescription>
              Get started by adding your first staff member to manage your team
              and assign permissions.
            </EmptyDescription>
          </EmptyHeader>

          <Protected perm="create:staff">
            <EmptyContent>
              <Button
                className="mx-auto"
                onClick={() => openStaffModal("create")}
              >
                <RiAddLine />
                Add Staff Member
              </Button>
            </EmptyContent>
          </Protected>
        </Empty>
      )}

      <StaffModal />
      <DeleteStaffDialog />
    </>
  )
}

function Header() {
  const openStaffModal = useStaffModal((s) => s.onOpen)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Staff Members
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your team and their access permissions
        </p>
      </div>
      <Protected perm="create:staff">
        <Button size="sm" onClick={() => openStaffModal("create")}>
          <RiAddLine />
          Add Staff
        </Button>
      </Protected>
    </div>
  )
}
