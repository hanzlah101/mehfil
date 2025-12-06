import { useState } from "react"
import { revalidateLogic, useStore } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useMealModal } from "@/stores/use-meal-modal"
import { EMPTY_NUMBER } from "@/lib/constants"
import { useAppForm } from "@/hooks/form-hooks"
import { MealItemsField } from "./meal-items-field"
import { MealMenuItemsField } from "./meal-menu-items-field"
import {
  mealSchema,
  type MealSchema,
  type MealMenuItemSchema
} from "@/validations/meals"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

export function MealForm() {
  const closeMealModal = useMealModal((s) => s.onClose)
  const initialValues = useMealModal((s) => s.meal)

  const { mutateAsync: createMeal } = useMutation({
    mutationFn: useConvexMutation(api.meals.create),
    onSuccess: () => {
      closeMealModal()
      toast.success("New Meal Created!")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create meal"
      )
    }
  })

  const { mutateAsync: updateMeal } = useMutation({
    mutationFn: useConvexMutation(api.meals.update),
    onSuccess: () => {
      closeMealModal()
      toast.success("Meal Updated Successfully!")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update meal"
      )
    }
  })

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: mealSchema
    },
    defaultValues: (() => {
      const type =
        (initialValues?.type as "package" | "items") ?? ("package" as const)
      if (type === "package") {
        return {
          type: "package" as const,
          title: initialValues?.title ?? "",
          pricePerHead: initialValues?.pricePerHead ?? 0,
          items: (initialValues?.items ?? []).filter(
            (item): item is MealMenuItemSchema =>
              item &&
              typeof item === "object" &&
              "name" in item &&
              !("qty" in item)
          )
        } satisfies MealSchema as MealSchema
      } else {
        type MealItemType = {
          name: string
          unit: string
          qty: number
          unitPrice: number
        }
        const itemsArray: MealItemType[] =
          initialValues?.items &&
          Array.isArray(initialValues.items) &&
          initialValues.items.some((item) => "qty" in item)
            ? initialValues.items.filter(
                (item): item is MealItemType =>
                  item &&
                  typeof item === "object" &&
                  "qty" in item &&
                  "unit" in item &&
                  "unitPrice" in item
              )
            : [
                {
                  name: "",
                  unit: "",
                  qty: EMPTY_NUMBER,
                  unitPrice: EMPTY_NUMBER
                }
              ]
        return {
          type: "items" as const,
          title: initialValues?.title ?? "",
          items: itemsArray
        } satisfies MealSchema
      }
    })(),
    onSubmit: async ({ formApi, value }) => {
      if (initialValues) {
        await updateMeal({ id: initialValues._id, ...value })
      } else {
        await createMeal(value)
      }
      formApi.reset()
    }
  })

  const isPending = useStore(form.store, (s) => s.isSubmitting)
  const mealType = useStore(form.store, (s) => s.values.type)
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [pendingTab, setPendingTab] = useState<"package" | "items" | null>(null)
  const [itemsToRemove, setItemsToRemove] = useState(0)

  const handleTabChange = (value: string) => {
    const newType = value as "package" | "items"
    const currentItems = form.getFieldValue("items") ?? []

    if (mealType === "items" && newType === "package") {
      const itemsWithData = currentItems.filter(
        (item: any) =>
          item &&
          typeof item === "object" &&
          "qty" in item &&
          "unit" in item &&
          "unitPrice" in item &&
          (item.name || item.qty > 0 || item.unitPrice > 0)
      )

      if (itemsWithData.length > 0) {
        setItemsToRemove(itemsWithData.length)
        setPendingTab(newType)
        setShowWarningDialog(true)
        return
      }
    }

    form.setFieldValue("type", newType)
    if (newType === "package") {
      form.setFieldValue("items", [])
    } else if (newType === "items") {
      if (!currentItems || currentItems.length === 0) {
        form.setFieldValue("items", [
          {
            name: "",
            unit: "",
            qty: EMPTY_NUMBER,
            unitPrice: EMPTY_NUMBER
          }
        ])
      }
    }
  }

  const confirmTabSwitch = () => {
    if (pendingTab) {
      form.setFieldValue("type", pendingTab)
      form.setFieldValue("items", [])
      setPendingTab(null)
    }
    setShowWarningDialog(false)
  }

  const cancelTabSwitch = () => {
    setPendingTab(null)
    setShowWarningDialog(false)
  }

  return (
    <>
      <form.Form>
        <form.Group>
          <form.AppField name="title">
            {(field) => (
              <field.Field>
                <field.Label required>Meal Title</field.Label>
                <field.Control>
                  <Input
                    autoFocus
                    placeholder="e.g., Biryani Combo"
                    disabled={isPending}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="type">
            {(field) => (
              <field.Field>
                <field.Label required>Meal Pricing Type</field.Label>
                <Tabs
                  value={field.state.value}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="package">Per Head</TabsTrigger>
                    <TabsTrigger value="items">Per Quantity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="package" className="mt-4 space-y-4">
                    <form.AppField name="pricePerHead">
                      {(priceField) => (
                        <priceField.Field>
                          <priceField.Label required>
                            Price Per Head
                          </priceField.Label>
                          <priceField.Control>
                            <NumberInput
                              placeholder="1500"
                              min={0}
                              disabled={isPending}
                              value={priceField.state.value}
                              onChange={(val) =>
                                priceField.handleChange(val as number)
                              }
                              onBlur={priceField.handleBlur}
                            />
                          </priceField.Control>
                          <priceField.Error />
                        </priceField.Field>
                      )}
                    </form.AppField>

                    <MealMenuItemsField fieldName="items" />
                  </TabsContent>

                  <TabsContent value="items" className="mt-4">
                    <MealItemsField fieldName="items" />
                  </TabsContent>
                </Tabs>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

          <div className="sticky bottom-0 z-10 w-full bg-background py-4">
            <Button type="submit" className="w-full" loading={isPending}>
              {initialValues ? "Save Changes" : "Create Meal"}
            </Button>
          </div>
        </form.Group>
      </form.Form>

      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Data Loss Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Switching to "Per Head" pricing will remove all quantity-based
              items you've entered.{" "}
              <span className="font-semibold text-destructive">
                {itemsToRemove} item{itemsToRemove !== 1 ? "s" : ""} will be
                removed.
              </span>
              <br />
              <br />
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTabSwitch}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmTabSwitch} variant="destructive">
              Continue & Remove Items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
