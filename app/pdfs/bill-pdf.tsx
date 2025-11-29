import * as React from "react"
import { format } from "date-fns"
import { calculateBillTotals, formatPrice } from "@/lib/utils"
import {
  Document,
  Page,
  Text,
  View,
  Svg,
  Path,
  Font
} from "@react-pdf/renderer"
import { createTw } from "react-pdf-tailwind"
import { getMealTypeFromTimes, formatMealType } from "@/lib/date"
import type { Doc } from "@db/_generated/dataModel"
import type { EventWithVenue } from "@/stores/use-event-modal"

Font.register({
  family: "Work Sans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/worksans/v18/QGY_z_wNahGAdqQ43RhVcIgYT2Xz5u32K3vXNigDp6_cOyA.ttf",
      fontWeight: 500
    },
    {
      src: "https://fonts.gstatic.com/s/worksans/v18/QGY_z_wNahGAdqQ43RhVcIgYT2Xz5u32K5fQNigDp6_cOyA.ttf",
      fontWeight: 600
    },
    {
      src: "https://fonts.gstatic.com/s/worksans/v18/QGY_z_wNahGAdqQ43RhVcIgYT2Xz5u32K67QNigDp6_cOyA.ttf",
      fontWeight: 700
    }
  ]
})

const tw = createTw({
  fontFamily: {
    sans: ["Work Sans"]
  }
})

// Icon Components
const MailIcon = ({ size = 12, color = "#666" }) => (
  <Svg style={{ width: size, height: size }} viewBox="0 0 24 24">
    <Path
      d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"
      fill={color}
    />
  </Svg>
)

const PhoneIcon = ({ size = 12, color = "#666" }) => (
  <Svg style={{ width: size, height: size }} viewBox="0 0 24 24">
    <Path
      d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"
      fill={color}
    />
  </Svg>
)

const CalendarIcon = ({ size = 12, color = "#666" }) => (
  <Svg style={{ width: size, height: size }} viewBox="0 0 24 24">
    <Path
      d="M2 11H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V11ZM17 3H21C21.5523 3 22 3.44772 22 4V9H2V4C2 3.44772 2.44772 3 3 3H7V1H9V3H15V1H17V3Z"
      fill={color}
    />
  </Svg>
)

const UserIcon = ({ size = 12, color = "#666" }) => (
  <Svg style={{ width: size, height: size }} viewBox="0 0 24 24">
    <Path
      d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"
      fill={color}
    />
  </Svg>
)

const LocationIcon = ({ size = 12, color = "#666" }) => (
  <Svg style={{ width: size, height: size }} viewBox="0 0 24 24">
    <Path
      d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
      fill={color}
    />
  </Svg>
)

type BillPDFProps = {
  event: EventWithVenue
  tenant?: Doc<"tenants">
}

export function BillPDF({ event, tenant }: BillPDFProps) {
  const billTotals = calculateBillTotals({
    meal: event.meal,
    addons: event.addons,
    discountedTotal: event.discountedTotal
  })

  const { subtotal, grandTotal, discountAmount, discountPercentage } =
    billTotals
  const amountPaid = event.amountPaid
  const remaining = grandTotal - amountPaid
  const isFullyPaid = remaining <= 0

  // Calculate item count for serial numbers
  const addons: Array<{
    name: string
    total: number
  }> = []

  const mealItems: Array<{
    name: string
    total: number
  }> = []

  // Add addons first (as requested)
  if (event.addons && event.addons.length > 0) {
    event.addons.forEach((addon) => {
      addons.push({
        name: addon.name,
        total: addon.qty * addon.unitPrice
      })
    })
  }

  // Add meal items
  if (event.meal) {
    event.meal.items.forEach((item) => {
      mealItems.push({
        name: item.name,
        total: item.qty * item.unitPrice
      })
    })
  }

  const allItems = [...addons, ...mealItems]
  const totalItems = allItems.length
  const isCompact = totalItems > 8
  const cellFontSize = isCompact ? "text-xs" : "text-sm"
  const rowPadding = isCompact ? "py-1.5" : "py-2.5"

  // Build event details array for clean 2-column layout
  const eventDetails: Array<{
    icon: React.ReactNode
    text: string
  }> = []

  eventDetails.push({
    icon: <CalendarIcon size={12} color="#9CA3AF" />,
    text: `${format(event.startTime, "MMM dd, yyyy")} • ${formatMealType(
      getMealTypeFromTimes(event.startTime, event.endTime)
    )}`
  })

  eventDetails.push({
    icon: <LocationIcon size={12} color="#9CA3AF" />,
    text: `${event.venue.name}${event.venue.location ? ` • ${event.venue.location}` : ""}`
  })

  if (typeof event.pax === "number") {
    eventDetails.push({
      icon: <UserIcon size={12} color="#9CA3AF" />,
      text: `${event.pax} guests`
    })
  }

  if (event.customerName) {
    eventDetails.push({
      icon: <UserIcon size={12} color="#9CA3AF" />,
      text: event.customerName
    })
  }

  if (event.customerPhone) {
    eventDetails.push({
      icon: <PhoneIcon size={12} color="#9CA3AF" />,
      text: event.customerPhone
    })
  }

  if (event.customerCNIC) {
    eventDetails.push({
      icon: <UserIcon size={12} color="#9CA3AF" />,
      text: `CNIC: ${event.customerCNIC}`
    })
  }

  return (
    <Document>
      <Page size="A4" style={tw("p-8 bg-white flex flex-col font-sans")}>
        {/* Header */}
        <View style={tw("mb-6 pb-4 border-b-2 border-gray-200")}>
          <View style={tw("flex-row justify-between items-start")}>
            <View>
              <Text style={tw("text-3xl font-bold text-gray-900")}>
                INVOICE
              </Text>
            </View>
            {tenant && (
              <View style={tw("items-end")}>
                <Text style={tw("text-lg font-bold text-gray-900")}>
                  {tenant.name}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Event Details with Icons - 2 Columns */}
        <View style={tw("mb-5")}>
          <View style={tw("flex-row flex-wrap")}>
            {eventDetails.map((detail, index) => {
              const isLeft = index % 2 === 0
              const isNewRow = index > 0 && index % 2 === 0

              return (
                <View
                  key={index}
                  style={tw(
                    `flex-row items-center gap-2 w-1/2 ${
                      isLeft ? "pr-4" : "pl-4"
                    } ${isNewRow ? "mt-2.5" : ""}`
                  )}
                >
                  {detail.icon}
                  <Text style={tw("text-sm text-gray-900")}>{detail.text}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Billing Items */}
        <View style={tw("mb-5")}>
          <Text style={tw("text-sm font-bold text-gray-900 mb-3")}>
            Billing Summary
          </Text>
          <View style={tw("border border-gray-300 rounded-lg")}>
            {/* Table Header */}
            <View
              style={tw(`flex-row bg-gray-100 rounded-t-lg ${rowPadding} px-4`)}
            >
              <Text
                style={tw(`${cellFontSize} font-bold text-gray-900 flex-1`)}
              >
                Item
              </Text>
              <Text
                style={tw(
                  `${cellFontSize} font-bold text-gray-900 w-24 text-right`
                )}
              >
                Amount
              </Text>
            </View>

            {/* Table Rows */}
            {allItems.length > 0 ? (
              allItems.map((item, index) => (
                <View
                  key={index}
                  style={tw(
                    `flex-row ${rowPadding} px-4 ${
                      index < allItems.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`
                  )}
                >
                  <Text
                    style={tw(
                      `${cellFontSize} text-gray-900 flex-1 font-medium`
                    )}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={tw(
                      `${cellFontSize} text-gray-900 w-24 text-right font-semibold`
                    )}
                  >
                    {formatPrice(item.total)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={tw("py-6 px-4")}>
                <Text style={tw(`${cellFontSize} text-gray-500 text-center`)}>
                  No items
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        <View style={tw("mb-5")}>
          <View style={tw("bg-gray-50 rounded-lg p-4")}>
            <View style={tw("flex-row justify-between mb-2.5")}>
              <Text style={tw(`${cellFontSize} text-gray-700 font-medium`)}>
                Subtotal
              </Text>
              <Text style={tw(`${cellFontSize} text-gray-900 font-semibold`)}>
                {formatPrice(subtotal)}
              </Text>
            </View>

            {discountAmount > 0 && (
              <View
                style={tw(
                  "flex-row justify-between mb-2.5 bg-green-50 -mx-1 px-3 py-2 rounded"
                )}
              >
                <Text style={tw(`${cellFontSize} text-green-700 font-medium`)}>
                  Discount ({discountPercentage}%)
                </Text>
                <Text style={tw(`${cellFontSize} text-green-700 font-bold`)}>
                  -{formatPrice(discountAmount)}
                </Text>
              </View>
            )}

            <View
              style={tw(
                "flex-row justify-between mt-3 pt-3 border-t-2 border-gray-300"
              )}
            >
              <Text style={tw("text-base font-bold text-gray-900")}>Total</Text>
              <Text style={tw("text-lg font-bold text-gray-900")}>
                {formatPrice(grandTotal)}
              </Text>
            </View>

            <View style={tw("flex-row justify-between mt-3")}>
              <Text style={tw(`${cellFontSize} text-gray-700 font-medium`)}>
                Amount Paid
              </Text>
              <Text style={tw(`${cellFontSize} text-gray-900 font-semibold`)}>
                {formatPrice(amountPaid)}
              </Text>
            </View>

            {/* Payment Status - Integrated */}
            <View
              style={tw(
                `mt-4 pt-4 border-t-2 ${
                  isFullyPaid ? "border-green-300" : "border-yellow-300"
                }`
              )}
            >
              <View style={tw("flex-row justify-between items-center")}>
                <Text
                  style={tw(
                    `text-sm font-semibold ${
                      isFullyPaid ? "text-green-700" : "text-yellow-700"
                    }`
                  )}
                >
                  {isFullyPaid ? "Status:" : "Remaining:"}
                </Text>
                <Text
                  style={tw(
                    `text-2xl font-bold ${
                      isFullyPaid ? "text-green-700" : "text-yellow-700"
                    }`
                  )}
                >
                  {isFullyPaid ? "Paid in Full" : formatPrice(remaining)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Signatures */}
        <View style={tw("mt-auto pt-6")}>
          <View style={tw("flex-row justify-between gap-6")}>
            <View style={tw("flex-1")}>
              <View style={tw("border-b-2 border-black mb-2 h-14")} />
              <Text
                style={tw(
                  `${cellFontSize} text-gray-700 text-center font-medium`
                )}
              >
                Customer Signature
              </Text>
            </View>
            <View style={tw("flex-1")}>
              <View style={tw("border-b-2 border-black mb-2 h-14")} />
              <Text
                style={tw(
                  `${cellFontSize} text-gray-700 text-center font-medium`
                )}
              >
                Manager Signature
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Contact Info */}
        {tenant && (
          <View style={tw("mt-5 pt-4")}>
            <View style={tw("flex-row flex-wrap")}>
              {tenant.managerPhone && (
                <View style={tw("flex-row items-center gap-2 w-1/2 pr-4")}>
                  <PhoneIcon size={11} color="#9CA3AF" />
                  <Text style={tw(`${cellFontSize} text-gray-700`)}>
                    Manager: {tenant.managerPhone}
                  </Text>
                </View>
              )}
              {tenant.mail && (
                <View
                  style={tw(
                    `flex-row items-center gap-2 w-1/2 ${
                      tenant.managerPhone ? "pl-4" : "pr-4"
                    }`
                  )}
                >
                  <MailIcon size={11} color="#9CA3AF" />
                  <Text style={tw(`${cellFontSize} text-gray-700`)}>
                    {tenant.mail}
                  </Text>
                </View>
              )}
              {tenant.complainPhone && (
                <View
                  style={tw(
                    `flex-row items-center gap-2 w-1/2 pr-4 ${
                      tenant.managerPhone || tenant.mail ? "mt-2" : ""
                    }`
                  )}
                >
                  <PhoneIcon size={11} color="#9CA3AF" />
                  <Text style={tw(`${cellFontSize} text-gray-700`)}>
                    Complaint: {tenant.complainPhone}
                  </Text>
                </View>
              )}
              {event.venue.location && (
                <View
                  style={tw(
                    `flex-row items-center gap-2 w-1/2 ${
                      tenant.complainPhone
                        ? "pl-4"
                        : tenant.mail
                          ? "pl-4"
                          : "pr-4"
                    } ${tenant.complainPhone || tenant.mail ? "mt-2" : ""}`
                  )}
                >
                  <LocationIcon size={11} color="#9CA3AF" />
                  <Text style={tw(`${cellFontSize} text-gray-700`)}>
                    {event.venue.location}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}
