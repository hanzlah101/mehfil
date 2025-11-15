import { convexQuery } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useMealModal } from "@/stores/use-meal-modal"
import { MealItem } from "./meal-item"
import { RiAddLine, RiRestaurant2Line } from "@remixicon/react"
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

export function MealsList() {
  const openMealModal = useMealModal((s) => s.onOpen)
  const { data, isLoading } = useQuery(convexQuery(api.meals.list, {}))

  if (isLoading) {
    return <PageLoader className="min-h-(--content-height)" />
  }

  return (
    <>
      {data && data.length > 0 ? (
        <div className="space-y-6">
          <Header />
          <ul className="grid gap-3 md:grid-cols-2">
            {data.map((meal) => (
              <MealItem key={meal._id} {...meal} />
            ))}
          </ul>
        </div>
      ) : (
        <Empty className="min-h-(--content-height)">
          <EmptyHeader className="max-w-md">
            <EmptyMedia variant="icon">
              <RiRestaurant2Line className="text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No meals created</EmptyTitle>
            <EmptyDescription>
              Get started by creating your first meal plan with items and
              pricing for your events.
            </EmptyDescription>
          </EmptyHeader>

          <Protected perm="create:meal">
            <EmptyContent>
              <Button
                className="mx-auto"
                onClick={() => openMealModal("create")}
              >
                <RiAddLine />
                Create Meal
              </Button>
            </EmptyContent>
          </Protected>
        </Empty>
      )}
    </>
  )
}

function Header() {
  const openMealModal = useMealModal((s) => s.onOpen)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Meals</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage meal plans with pricing
        </p>
      </div>
      <Protected perm="create:meal">
        <Button size="sm" onClick={() => openMealModal("create")}>
          <RiAddLine />
          New Meal
        </Button>
      </Protected>
    </div>
  )
}
