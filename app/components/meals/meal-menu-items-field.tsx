import { useFormContext } from "@/hooks/form-hooks"
import { Input } from "@/components/ui/input"
import { useStore } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { MealSchema } from "@/validations/meals"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

export function MealMenuItemsField({ fieldName }: { fieldName: string }) {
  const form = useFormContext<MealSchema>()
  const isPending = useStore(form.store, (s) => s.isSubmitting)

  const itemsFieldName = fieldName as "items"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Menu Items</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Optional list of items included in this package
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => {
            const currentItems = form.getFieldValue(itemsFieldName) ?? []
            form.setFieldValue(itemsFieldName, [...currentItems, { name: "" }])
          }}
        >
          <RiAddLine size={16} />
          Add Item
        </Button>
      </div>

      <form.AppField name={itemsFieldName} mode="array">
        {(itemsField) => (
          <itemsField.Field>
            {itemsField.state.value && itemsField.state.value.length > 0 ? (
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px] text-center">#</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead className="w-[80px] text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemsField.state.value.map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <form.AppField name={`${itemsFieldName}[${i}].name`}>
                            {(field) => (
                              <field.Field>
                                <field.Control>
                                  <Input
                                    placeholder="e.g., Chicken Biryani"
                                    disabled={isPending}
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                    className="border-0 focus-visible:ring-1"
                                  />
                                </field.Control>
                                <field.Error />
                              </field.Field>
                            )}
                          </form.AppField>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            type="button"
                            disabled={isPending}
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => itemsField.removeValue(i)}
                          >
                            <RiDeleteBin6Line
                              size={16}
                              className="text-destructive"
                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No menu items added yet. Click &quot;Add Item&quot; to create
                  a menu list.
                </p>
              </div>
            )}

            <itemsField.Error />
          </itemsField.Field>
        )}
      </form.AppField>
    </div>
  )
}
