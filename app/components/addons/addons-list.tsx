import { convexQuery } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useAddonModal } from "@/stores/use-addon-modal"
import { AddonItem } from "./addon-item"
import { RiAddLine, RiStarLine } from "@remixicon/react"
import { Protected } from "@/components/protected"
import { PageLoader } from "@/components/page-loader"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"

export function AddonsList() {
  const openAddonModal = useAddonModal((s) => s.onOpen)
  const { data, isLoading } = useQuery(convexQuery(api.addons.list, {}))

  if (isLoading) {
    return <PageLoader className="min-h-(--content-height)" />
  }

  return (
    <>
      {data && data.length > 0 ? (
        <div className="space-y-6">
          <Header />
          <ul className="grid gap-3 md:grid-cols-2">
            {data.map((addon) => (
              <AddonItem key={addon._id} {...addon} />
            ))}
          </ul>
        </div>
      ) : (
        <Empty className="min-h-(--content-height)">
          <EmptyHeader className="max-w-md">
            <EmptyMedia variant="icon">
              <RiStarLine className="text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No addons created</EmptyTitle>
            <EmptyDescription>
              Get started by creating your first addon with pricing for your
              events.
            </EmptyDescription>
          </EmptyHeader>

          <Protected perm="create:addon">
            <EmptyContent>
              <Button
                className="mx-auto"
                onClick={() => openAddonModal("create")}
              >
                <RiAddLine />
                Create Addon
              </Button>
            </EmptyContent>
          </Protected>
        </Empty>
      )}
    </>
  )
}

function Header() {
  const openAddonModal = useAddonModal((s) => s.onOpen)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Addons</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage addons with pricing
        </p>
      </div>
      <Protected perm="create:addon">
        <Button size="sm" onClick={() => openAddonModal("create")}>
          <RiAddLine />
          New Addon
        </Button>
      </Protected>
    </div>
  )
}
