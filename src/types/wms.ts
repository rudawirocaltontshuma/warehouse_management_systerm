// Domain types for the WMS portfolio demonstration.
// All data described by these types is fictional and generated locally — see src/data/wms.

export type ID = string;

export type WarehouseStatus = "operational" | "reduced-capacity" | "maintenance";

export interface Warehouse {
  id: ID;
  code: string;
  name: string;
  city: string;
  province: string;
  address: string;
  totalCapacity: number;
  usedCapacity: number;
  skuCount: number;
  unitCount: number;
  inventoryValue: number;
  inbound: number;
  outbound: number;
  status: WarehouseStatus;
  manager: string;
  zoneCount: number;
  workerCount: number;
}

export interface Zone {
  id: ID;
  code: string;
  name: string;
  warehouseId: ID;
  purpose: "Receiving" | "Bulk Storage" | "Picking" | "Packing" | "Dispatch" | "Returns";
  capacity: number;
  used: number;
  skuCount: number;
  unitCount: number;
  status: "active" | "restricted" | "offline";
}

export interface Aisle {
  id: ID;
  code: string;
  zoneId: ID;
  warehouseId: ID;
  locationCount: number;
  capacity: number;
  used: number;
  status: "active" | "restricted" | "offline";
}

export interface Bin {
  id: ID;
  code: string;
  warehouseId: ID;
  zoneId: ID;
  aisleId: ID;
  rack: string;
  bin: string;
  capacity: number;
  occupied: number;
  status: "active" | "restricted" | "offline" | "empty";
}

export type LocationRecord = Bin;

export interface Category {
  id: ID;
  name: string;
  productCount: number;
  unitCount: number;
  inventoryValue: number;
  status: "active" | "inactive";
}

export interface Product {
  id: ID;
  sku: string;
  name: string;
  category: string;
  brand: string;
  barcode: string;
  barcodeType: "EAN-13" | "UPC-A" | "Code128";
  unitCost: number;
  sellingPrice: number;
  weightKg: number;
  dimensionsCm: string;
  reorderLevel: number;
  reorderMax: number;
  primaryWarehouseId: ID;
  units: number;
  status: "active" | "discontinued" | "seasonal";
  imageColor: string;
}

export interface ProductLocation {
  id: ID;
  sku: string;
  warehouseId: ID;
  zoneId: ID;
  aisleCode: string;
  rack: string;
  bin: string;
  quantity: number;
  capacity: number;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "overstock";

export interface InventoryItem {
  id: ID;
  sku: string;
  productId: ID;
  warehouseId: ID;
  locationCode: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  maximum: number;
  status: StockStatus;
  lastCounted: string;
}

export type MovementType = "Receipt" | "Putaway" | "Pick" | "Transfer" | "Adjustment" | "Return";

export interface StockMovement {
  id: ID;
  date: string;
  sku: string;
  productName: string;
  warehouseId: ID;
  locationCode: string;
  quantity: number;
  type: MovementType;
  reference: string;
  user: string;
}

export type AdjustmentReason = "Damage" | "Count Difference" | "Expiration" | "Correction" | "Other";

export interface StockAdjustment {
  id: ID;
  sku: string;
  productName: string;
  locationCode: string;
  currentQuantity: number;
  adjustedQuantity: number;
  reason: AdjustmentReason;
  requestedBy: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

export type CycleCountStatus = "Scheduled" | "In Progress" | "Completed" | "Variance Review";

export interface CycleCountLine {
  sku: string;
  productName: string;
  systemQuantity: number;
  countedQuantity: number;
}

export interface CycleCount {
  id: ID;
  warehouseId: ID;
  zone: string;
  location: string;
  scheduledDate: string;
  items: number;
  assignedWorker: string;
  accuracy: number;
  status: CycleCountStatus;
  lines: CycleCountLine[];
}

export type TransferStatus = "Draft" | "Requested" | "Approved" | "In Transit" | "Completed" | "Cancelled";

export interface Transfer {
  id: ID;
  sourceWarehouseId: ID;
  destinationWarehouseId: ID;
  items: number;
  quantity: number;
  requestedBy: string;
  date: string;
  status: TransferStatus;
  lines: { sku: string; productName: string; quantity: number }[];
}

export type OrderStatus = "Pending" | "Allocated" | "Picking" | "Packing" | "Shipped" | "Completed" | "Cancelled";

export type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed";
export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface OrderLine {
  sku: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: ID;
  orderNumber: string;
  customer: string;
  date: string;
  items: number;
  quantity: number;
  value: number;
  priority: Priority;
  warehouseId: ID;
  fulfillmentStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  billingAddress: string;
  lines: OrderLine[];
}

export type POStatus = "Draft" | "Submitted" | "Approved" | "Partially Received" | "Received" | "Cancelled";

export interface PurchaseOrder {
  id: ID;
  poNumber: string;
  supplierId: ID;
  warehouseId: ID;
  orderDate: string;
  expectedDate: string;
  items: number;
  amount: number;
  status: POStatus;
  lines: { sku: string; productName: string; quantity: number; unitCost: number }[];
}

export interface Backorder {
  id: ID;
  orderNumber: string;
  customer: string;
  sku: string;
  productName: string;
  requestedQuantity: number;
  available: number;
  backordered: number;
  expectedDate: string;
  priority: Priority;
  status: "Waiting on Supplier" | "Partial Allocation" | "Ready to Fulfill";
}

export type ReceiptStatus = "Expected" | "Arrived" | "Receiving" | "Completed" | "Exception";

export interface Receipt {
  id: ID;
  receiptNumber: string;
  poNumber: string;
  supplierId: ID;
  warehouseId: ID;
  dock: string;
  expectedDate: string;
  actualArrival: string | null;
  items: number;
  expectedQuantity: number;
  receivedQuantity: number;
  damagedQuantity: number;
  status: ReceiptStatus;
  notes: string;
  timeline: ActivityEvent[];
}

export type PutawayStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Exception";

export interface PutawayTask {
  id: ID;
  taskNumber: string;
  sku: string;
  productName: string;
  quantity: number;
  from: string;
  to: string;
  priority: Priority;
  assignedWorker: string;
  status: PutawayStatus;
  warehouseId: ID;
}

export type PickStatus = "Queued" | "Assigned" | "In Progress" | "Completed" | "Exception";

export interface PickLine {
  sku: string;
  productName: string;
  location: string;
  quantity: number;
  picked: number;
}

export interface PickTask {
  id: ID;
  pickListId: string;
  orderNumber: string;
  customer: string;
  priority: Priority;
  items: number;
  warehouseId: ID;
  zone: string;
  worker: string;
  created: string;
  status: PickStatus;
  lines: PickLine[];
}

export type PackStatus = "Ready" | "Packing" | "Packed" | "Exception";

export interface PackTask {
  id: ID;
  packingId: string;
  orderNumber: string;
  customer: string;
  items: number;
  packageType: string;
  weightKg: number;
  dimensionsCm: string;
  station: string;
  worker: string;
  status: PackStatus;
}

export type ShipmentStatus =
  | "Order Confirmed"
  | "Packed"
  | "Dispatched"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed";

export interface Shipment {
  id: ID;
  shipmentNumber: string;
  orderNumber: string;
  customer: string;
  carrier: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  weightKg: number;
  packages: number;
  shipDate: string;
  expectedDelivery: string;
  status: ShipmentStatus;
  timeline: ActivityEvent[];
}

export type ReturnReason = "Damaged" | "Wrong Item" | "Defective" | "Customer Return" | "Other";

export interface ReturnRequest {
  id: ID;
  returnNumber: string;
  orderNumber: string;
  customer: string;
  reason: ReturnReason;
  items: number;
  date: string;
  status: "Awaiting Inspection" | "Approved" | "Rejected" | "Completed";
}

export interface Supplier {
  id: ID;
  supplierId: string;
  name: string;
  category: string;
  city: string;
  province: string;
  products: number;
  openOrders: number;
  deliveryAccuracy: number;
  onTimeDelivery: number;
  orderAccuracy: number;
  leadTimeDays: number;
  defectRate: number;
  spend: number;
  orders: number;
  status: "active" | "under-review" | "inactive";
}

export type WorkerDepartment = "Receiving" | "Putaway" | "Picking" | "Packing" | "Shipping" | "Inventory";
export type WorkerStatus = "Active" | "On Break" | "Off Shift" | "Inactive";

export interface Worker {
  id: ID;
  workerId: string;
  name: string;
  department: WorkerDepartment;
  role: string;
  warehouseId: ID;
  shift: "Morning" | "Afternoon" | "Night";
  tasksCompleted: number;
  productivity: number;
  accuracy: number;
  avgPickTimeSeconds: number;
  status: WorkerStatus;
}

export type WarehouseTaskType =
  | "Receiving"
  | "Putaway"
  | "Picking"
  | "Packing"
  | "Cycle Count"
  | "Transfer"
  | "Loading";
export type WarehouseTaskStatus = "Queued" | "Assigned" | "In Progress" | "Review" | "Completed";

export interface WarehouseTask {
  id: ID;
  taskNumber: string;
  type: WarehouseTaskType;
  priority: Priority;
  location: string;
  worker: string;
  created: string;
  due: string;
  status: WarehouseTaskStatus;
}

export interface Shift {
  id: ID;
  name: "Morning" | "Afternoon" | "Night";
  start: string;
  end: string;
  workers: number;
  warehouseId: ID;
  status: "active" | "upcoming" | "ended";
}

export interface Carrier {
  id: ID;
  name: string;
  shipments: number;
  onTimeRate: number;
  avgDeliveryDays: number;
  status: "active" | "inactive";
}

export interface DeliveryRoute {
  id: ID;
  routeId: string;
  origin: string;
  destination: string;
  stops: number;
  shipments: number;
  driver: string;
  vehicle: string;
  departure: string;
  eta: string;
  status: "Scheduled" | "En Route" | "Completed" | "Delayed";
}

export interface ActivityEvent {
  id: ID;
  label: string;
  timestamp: string;
  description?: string;
  actor?: string;
}

export interface Report {
  id: ID;
  name: string;
  description: string;
  category: string;
  lastUpdated: string;
}

export type NotificationSeverity = "info" | "warning" | "danger" | "success";

export interface Notification {
  id: ID;
  message: string;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
  link?: string;
}

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";
