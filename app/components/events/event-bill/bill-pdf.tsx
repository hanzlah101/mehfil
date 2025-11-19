import { format } from "date-fns"
import { calculateBillTotals, formatPrice } from "@/lib/utils"
import type { Doc } from "@db/_generated/dataModel"
import type { EventWithVenue } from "@/stores/use-event-modal"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path
} from "@react-pdf/renderer"

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

type BillPDFProps = {
  event: EventWithVenue
  tenant?: Doc<"tenants">
}

// Icon Components using RemixIcon filled icons as SVG paths
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

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Work Sans",
    backgroundColor: "#FFFFFF",
    color: "#1F2937"
  },
  header: {
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  headerLeft: {
    flex: 1
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: -0.5
  },
  headerRight: {
    alignItems: "flex-end"
  },
  tenantNameHeader: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827"
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    minWidth: "45%"
  },
  iconWrapper: {
    marginRight: 8,
    marginTop: 2
  },
  detailText: {
    fontSize: 10,
    color: "#1F2937",
    fontWeight: 500,
    flexShrink: 1
  },
  table: {
    marginTop: 12
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 600,
    color: "#1F2937",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6"
  },
  tableRowLast: {
    borderBottomWidth: 0
  },
  tableCell: {
    fontSize: 9,
    fontWeight: 500
  },
  serialNumber: {
    width: "8%",
    color: "#1F2937"
  },
  itemName: {
    width: "40%",
    fontWeight: 500,
    color: "#1F2937"
  },
  quantity: {
    width: "15%",
    textAlign: "center",
    color: "#737373"
  },
  unitPrice: {
    width: "18%",
    textAlign: "right",
    color: "#737373"
  },
  total: {
    width: "19%",
    textAlign: "right",
    fontWeight: 600,
    color: "#111827"
  },
  summarySection: {
    marginTop: 24
  },
  summaryBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 8
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  summaryLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: 500
  },
  summaryValue: {
    fontSize: 10,
    color: "#1F2937",
    fontWeight: 600
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ECFDF5",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  discountLabel: {
    fontSize: 9,
    color: "#059669",
    fontWeight: 500
  },
  discountValue: {
    fontSize: 9,
    color: "#059669",
    fontWeight: 600
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#E5E7EB"
  },
  grandTotalLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#111827"
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827"
  },
  paymentStatusSection: {
    marginTop: 20
  },
  paymentStatus: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1.5
  },
  paidStatus: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981"
  },
  pendingStatus: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B"
  },
  statusText: {
    fontSize: 11,
    fontWeight: 600
  },
  paidText: {
    color: "#059669"
  },
  pendingText: {
    color: "#D97706"
  },
  remainingText: {
    fontSize: 10,
    fontWeight: 500,
    color: "#92400E",
    marginTop: 6
  },
  tenantFooter: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1.5,
    borderTopColor: "#E5E7EB"
  },
  contactInfoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  contactColumn: {
    flexDirection: "column",
    gap: 8
  },
  tenantInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  tenantInfoText: {
    fontSize: 10,
    color: "#374151",
    marginLeft: 8,
    fontWeight: 500
  }
})

export function BillPDF({ event, tenant }: BillPDFProps) {
  const billTotals = calculateBillTotals({
    hallCharges: event.hallCharges,
    meal: event.meal,
    discountedTotal: event.discountedTotal
  })

  const { subtotal, grandTotal, discountAmount, discountPercentage } =
    billTotals
  const amountPaid = event.amountPaid
  const remaining = grandTotal - amountPaid
  const isFullyPaid = remaining <= 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
          </View>
          {tenant && (
            <View style={styles.headerRight}>
              <Text style={styles.tenantNameHeader}>{tenant.name}</Text>
            </View>
          )}
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.iconWrapper}>
                <CalendarIcon size={12} color="#6B7280" />
              </View>
              <Text style={styles.detailText}>
                {format(event.startTime, "MMM dd, yyyy")} •{" "}
                {format(event.startTime, "h:mm a")} -{" "}
                {format(event.endTime, "h:mm a")}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.iconWrapper}>
                <LocationIcon size={12} color="#6B7280" />
              </View>
              <Text style={styles.detailText}>
                {event.venue.name}
                {event.venue.location && ` (${event.venue.location})`}
              </Text>
            </View>

            {typeof event.pax === "number" && (
              <View style={styles.detailItem}>
                <View style={styles.iconWrapper}>
                  <UserIcon size={12} color="#6B7280" />
                </View>
                <Text style={styles.detailText}>{event.pax} guests</Text>
              </View>
            )}

            {event.customerName && (
              <View style={styles.detailItem}>
                <View style={styles.iconWrapper}>
                  <UserIcon size={12} color="#6B7280" />
                </View>
                <Text style={styles.detailText}>{event.customerName}</Text>
              </View>
            )}

            {event.customerPhone && (
              <View style={styles.detailItem}>
                <View style={styles.iconWrapper}>
                  <PhoneIcon size={12} color="#6B7280" />
                </View>
                <Text style={styles.detailText}>{event.customerPhone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.serialNumber]}>
                #
              </Text>
              <Text style={[styles.tableHeaderText, styles.itemName]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderText, styles.quantity]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.unitPrice]}>
                Unit Price
              </Text>
              <Text style={[styles.tableHeaderText, styles.total]}>Total</Text>
            </View>

            {/* Hall Charges Row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.serialNumber]}>1</Text>
              <Text style={[styles.tableCell, styles.itemName]}>
                {event.venue.name} - Hall Charges
              </Text>
              <Text style={[styles.tableCell, styles.quantity]}>—</Text>
              <Text style={[styles.tableCell, styles.unitPrice]}>
                {formatPrice(event.hallCharges)}
              </Text>
              <Text style={[styles.tableCell, styles.total]}>
                {formatPrice(event.hallCharges)}
              </Text>
            </View>

            {/* Meal Items */}
            {event.meal &&
              event.meal.items.map((item, index) => {
                const isLastItem = index === (event.meal?.items.length ?? 0) - 1
                return (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      isLastItem ? styles.tableRowLast : undefined
                    ].filter((s): s is NonNullable<typeof s> => !!s)}
                  >
                    <Text style={[styles.tableCell, styles.serialNumber]}>
                      {index + 2}
                    </Text>
                    <Text style={[styles.tableCell, styles.itemName]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.tableCell, styles.quantity]}>
                      {item.qty} {item.unit}
                    </Text>
                    <Text style={[styles.tableCell, styles.unitPrice]}>
                      {formatPrice(item.unitPrice)}
                    </Text>
                    <Text style={[styles.tableCell, styles.total]}>
                      {formatPrice(item.qty * item.unitPrice)}
                    </Text>
                  </View>
                )
              })}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.discountRow}>
                <Text style={styles.discountLabel}>
                  Discount ({discountPercentage}%)
                </Text>
                <Text style={styles.discountValue}>
                  -{formatPrice(discountAmount)}
                </Text>
              </View>
            )}

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                {formatPrice(grandTotal)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount Paid</Text>
              <Text style={styles.summaryValue}>{formatPrice(amountPaid)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Status */}
        <View style={styles.paymentStatusSection}>
          <View
            style={[
              styles.paymentStatus,
              isFullyPaid ? styles.paidStatus : styles.pendingStatus
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isFullyPaid ? styles.paidText : styles.pendingText
              ]}
            >
              {isFullyPaid ? "Paid in Full" : "Payment Pending"}
            </Text>
            {!isFullyPaid && (
              <Text style={styles.remainingText}>
                Remaining: {formatPrice(remaining)}
              </Text>
            )}
          </View>
        </View>

        {/* Tenant Contact Details Footer */}
        {tenant && (
          <View style={styles.tenantFooter}>
            <View style={styles.contactInfoGrid}>
              <View style={styles.contactColumn}>
                {tenant.managerPhone && (
                  <View style={styles.tenantInfoItem}>
                    <PhoneIcon size={12} color="#4B5563" />
                    <Text style={styles.tenantInfoText}>
                      Manager: {tenant.managerPhone}
                    </Text>
                  </View>
                )}
                {tenant.complainPhone && (
                  <View style={styles.tenantInfoItem}>
                    <PhoneIcon size={12} color="#4B5563" />
                    <Text style={styles.tenantInfoText}>
                      Complaint: {tenant.complainPhone}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.contactColumn}>
                {tenant.mail && (
                  <View style={styles.tenantInfoItem}>
                    <MailIcon size={12} color="#4B5563" />
                    <Text style={styles.tenantInfoText}>{tenant.mail}</Text>
                  </View>
                )}
                {event.venue.location && (
                  <View style={styles.tenantInfoItem}>
                    <LocationIcon size={12} color="#4B5563" />
                    <Text style={styles.tenantInfoText}>
                      {event.venue.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}
