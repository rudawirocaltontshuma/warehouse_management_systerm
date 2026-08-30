import type {
  Aisle,
  Backorder,
  Bin,
  Carrier,
  Category,
  CycleCount,
  DeliveryRoute,
  InventoryItem,
  Notification,
  Order,
  PackTask,
  PickTask,
  Product,
  ProductLocation,
  PurchaseOrder,
  PutawayTask,
  Receipt,
  Report,
  ReturnRequest,
  Shift,
  Shipment,
  StockAdjustment,
  StockMovement,
  Supplier,
  Transfer,
  Warehouse,
  WarehouseTask,
  Worker,
  Zone,
} from "@/types/wms";

import {
  BRANDS,
  CARRIERS,
  CATEGORIES,
  CUSTOMER_NAMES,
  DOCKS,
  FIRST_NAMES,
  LAST_NAMES,
  PRODUCT_NOUNS,
  SUPPLIER_NAMES,
  WAREHOUSE_SEED,
  ZONE_TEMPLATES,
} from "./constants";
import { createRng, daysFromToday, floatBetween, intBetween, pad, pick, pickWeighted } from "./rng";

const rng = createRng(90210);

function fullName() {
  return `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
}

// ---------------------------------------------------------------------------
// Warehouses, zones, aisles, bins
// ---------------------------------------------------------------------------

export const warehouses: Warehouse[] = WAREHOUSE_SEED.map((seed, index) => {
  const usedCapacity = Math.round(seed.totalCapacity * floatBetween(rng, 0.62, 0.93));
  return {
    id: seed.id,
    code: seed.code,
    name: seed.name,
    city: seed.city,
    province: seed.province,
    address: seed.address,
    totalCapacity: seed.totalCapacity,
    usedCapacity,
    skuCount: intBetween(rng, 900, 2400),
    unitCount: intBetween(rng, 40000, 95000),
    inventoryValue: intBetween(rng, 3200000, 8600000),
    inbound: intBetween(rng, 6, 24),
    outbound: intBetween(rng, 10, 40),
    status: index === 3 ? "reduced-capacity" : "operational",
    manager: seed.manager,
    zoneCount: ZONE_TEMPLATES.length,
    workerCount: intBetween(rng, 45, 120),
  };
});

export const zones: Zone[] = warehouses.flatMap((wh) =>
  ZONE_TEMPLATES.map((zt, i) => {
    const capacity = intBetween(rng, 8000, 22000);
    return {
      id: `${wh.id}-zone-${zt.code}`,
      code: zt.code,
      name: zt.name,
      warehouseId: wh.id,
      purpose: zt.purpose,
      capacity,
      used: Math.round(capacity * floatBetween(rng, 0.4, 0.95)),
      skuCount: intBetween(rng, 80, 420),
      unitCount: intBetween(rng, 2000, 18000),
      status: i === 5 && rng() > 0.7 ? "restricted" : "active",
    } satisfies Zone;
  }),
);

export const aisles: Aisle[] = zones.flatMap((zone) =>
  Array.from({ length: 4 }, (_, i) => {
    const capacity = intBetween(rng, 1200, 3600);
    return {
      id: `${zone.id}-aisle-${i + 1}`,
      code: `${zone.code}-A${i + 1}`,
      zoneId: zone.id,
      warehouseId: zone.warehouseId,
      locationCount: intBetween(rng, 18, 48),
      capacity,
      used: Math.round(capacity * floatBetween(rng, 0.3, 0.96)),
      status: rng() > 0.92 ? "restricted" : "active",
    } satisfies Aisle;
  }),
);

export const bins: Bin[] = aisles.flatMap((aisle) =>
  Array.from({ length: intBetween(rng, 4, 7) }, (_, i) => {
    const capacity = intBetween(rng, 40, 180);
    const rack = pad(intBetween(rng, 1, 20), 2);
    const binNo = pad(i + 1, 2);
    return {
      id: `${aisle.id}-bin-${i + 1}`,
      code: `${aisle.code}-${rack}-${binNo}`,
      warehouseId: aisle.warehouseId,
      zoneId: aisle.zoneId,
      aisleId: aisle.id,
      rack,
      bin: binNo,
      capacity,
      occupied: Math.round(capacity * floatBetween(rng, 0, 1)),
      status: rng() > 0.94 ? "restricted" : "active",
    } satisfies Bin;
  }),
);

export const warehouseByCode = Object.fromEntries(warehouses.map((w) => [w.code, w]));

// ---------------------------------------------------------------------------
// Categories & Products
// ---------------------------------------------------------------------------

let skuCounter = 10000;
export const products: Product[] = [];

for (const category of CATEGORIES) {
  const nouns = PRODUCT_NOUNS[category];
  for (const noun of nouns) {
    for (let variant = 0; variant < 2; variant += 1) {
      skuCounter += intBetween(rng, 3, 19);
      const unitCost = floatBetween(rng, 45, 4200);
      const warehouse = pick(rng, warehouses);
      products.push({
        id: `prod-${skuCounter}`,
        sku: `SKU-${skuCounter}`,
        name: variant === 0 ? noun : `${noun} — ${pick(rng, ["Compact", "Heavy-Duty", "Pro", "XL", "Standard"])}`,
        category,
        brand: pick(rng, BRANDS),
        barcode: `600${intBetween(rng, 1000000000, 9999999999)}`.slice(0, 13),
        barcodeType: pickWeighted(rng, [
          ["EAN-13", 6],
          ["UPC-A", 2],
          ["Code128", 2],
        ]),
        unitCost,
        sellingPrice: Math.round(unitCost * floatBetween(rng, 1.25, 1.75) * 100) / 100,
        weightKg: floatBetween(rng, 0.2, 85, 1),
        dimensionsCm: `${intBetween(rng, 10, 120)} x ${intBetween(rng, 10, 100)} x ${intBetween(rng, 5, 90)}`,
        reorderLevel: intBetween(rng, 40, 200),
        reorderMax: intBetween(rng, 400, 1200),
        primaryWarehouseId: warehouse.id,
        units: intBetween(rng, 0, 4200),
        status: pickWeighted(rng, [
          ["active", 8],
          ["seasonal", 1],
          ["discontinued", 1],
        ]),
        imageColor: pick(rng, ["#2563eb", "#059669", "#d97706", "#7c3aed", "#dc2626", "#0891b2"]),
      });
    }
  }
}

export const categories: Category[] = CATEGORIES.map((name) => {
  const inCategory = products.filter((p) => p.category === name);
  return {
    id: `cat-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    productCount: inCategory.length,
    unitCount: inCategory.reduce((sum, p) => sum + p.units, 0),
    inventoryValue: Math.round(inCategory.reduce((sum, p) => sum + p.units * p.unitCost, 0)),
    status: "active",
  } satisfies Category;
});

export const productLocations: ProductLocation[] = products.map((product, idx) => {
  const wh = warehouses.find((w) => w.id === product.primaryWarehouseId)!;
  const zone = zones.find((z) => z.warehouseId === wh.id && z.purpose === "Bulk Storage")!;
  const aisleList = aisles.filter((a) => a.zoneId === zone.id);
  const aisle = aisleList[idx % aisleList.length]!;
  const binList = bins.filter((b) => b.aisleId === aisle.id);
  const bin = binList[idx % binList.length]!;
  return {
    id: `ploc-${product.id}`,
    sku: product.sku,
    warehouseId: wh.id,
    zoneId: zone.id,
    aisleCode: aisle.code,
    rack: bin.rack,
    bin: bin.bin,
    quantity: product.units,
    capacity: bin.capacity,
  } satisfies ProductLocation;
});

export const locationCodeFor = (product: Product) => {
  const loc = productLocations.find((l) => l.sku === product.sku)!;
  const wh = warehouses.find((w) => w.id === loc.warehouseId)!;
  return `${wh.code}-${loc.zoneId.split("-zone-")[1]}-${loc.aisleCode}-${loc.rack}-${loc.bin}`;
};

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export const inventory: InventoryItem[] = products.flatMap((product, idx) => {
  const spread = idx % 3 === 0 ? 2 : 1;
  return Array.from({ length: spread }, (_, i) => {
    const wh = i === 0 ? warehouses.find((w) => w.id === product.primaryWarehouseId)! : pick(rng, warehouses);
    const onHand = i === 0 ? product.units : intBetween(rng, 0, 900);
    const reserved = Math.round(onHand * floatBetween(rng, 0, 0.35));
    const available = onHand - reserved;
    let status: InventoryItem["status"] = "in-stock";
    if (onHand === 0) status = "out-of-stock";
    else if (onHand < product.reorderLevel) status = "low-stock";
    else if (onHand > product.reorderMax) status = "overstock";
    return {
      id: `inv-${product.id}-${i}`,
      sku: product.sku,
      productId: product.id,
      warehouseId: wh.id,
      locationCode: locationCodeFor(product),
      onHand,
      reserved,
      available,
      reorderPoint: product.reorderLevel,
      maximum: product.reorderMax,
      status,
      lastCounted: daysFromToday(-intBetween(rng, 1, 60)),
    } satisfies InventoryItem;
  });
});

// ---------------------------------------------------------------------------
// Suppliers
// ---------------------------------------------------------------------------

export const suppliers: Supplier[] = SUPPLIER_NAMES.map((name, i) => {
  const wh = pick(rng, warehouses);
  return {
    id: `sup-${i + 1}`,
    supplierId: `SUP-${pad(2000 + i, 4)}`,
    name,
    category: pick(rng, CATEGORIES),
    city: wh.city,
    province: wh.province,
    products: intBetween(rng, 4, 48),
    openOrders: intBetween(rng, 0, 9),
    deliveryAccuracy: floatBetween(rng, 82, 99.5, 1),
    onTimeDelivery: floatBetween(rng, 78, 99, 1),
    orderAccuracy: floatBetween(rng, 85, 99.8, 1),
    leadTimeDays: intBetween(rng, 2, 21),
    defectRate: floatBetween(rng, 0.1, 4.5, 2),
    spend: intBetween(rng, 120000, 4200000),
    orders: intBetween(rng, 8, 120),
    status: pickWeighted(rng, [
      ["active", 9],
      ["under-review", 2],
      ["inactive", 1],
    ]),
  } satisfies Supplier;
});

// ---------------------------------------------------------------------------
// Workers
// ---------------------------------------------------------------------------

const DEPARTMENTS = ["Receiving", "Putaway", "Picking", "Packing", "Shipping", "Inventory"] as const;
const ROLE_BY_DEPT: Record<(typeof DEPARTMENTS)[number], string[]> = {
  Receiving: ["Receiving Clerk", "Dock Supervisor"],
  Putaway: ["Putaway Operator", "Forklift Operator"],
  Picking: ["Picker", "Pick Team Lead"],
  Packing: ["Packer", "Packing Station Lead"],
  Shipping: ["Shipping Coordinator", "Loading Operator"],
  Inventory: ["Inventory Analyst", "Cycle Count Auditor"],
};

export const workers: Worker[] = Array.from({ length: 42 }, (_, i) => {
  const dept = pick(rng, DEPARTMENTS);
  const wh = pick(rng, warehouses);
  return {
    id: `wrk-${i + 1}`,
    workerId: `WRK-${pad(3000 + i, 4)}`,
    name: fullName(),
    department: dept,
    role: pick(rng, ROLE_BY_DEPT[dept]),
    warehouseId: wh.id,
    shift: pickWeighted(rng, [
      ["Morning", 4],
      ["Afternoon", 3],
      ["Night", 2],
    ]),
    tasksCompleted: intBetween(rng, 120, 940),
    productivity: intBetween(rng, 68, 99),
    accuracy: floatBetween(rng, 90, 100, 1),
    avgPickTimeSeconds: intBetween(rng, 22, 95),
    status: pickWeighted(rng, [
      ["Active", 6],
      ["On Break", 1],
      ["Off Shift", 2],
      ["Inactive", 1],
    ]),
  } satisfies Worker;
});

export const shifts: Shift[] = warehouses
  .flatMap((wh) => [
    { id: `${wh.id}-shift-morning`, name: "Morning" as const, start: "06:00", end: "14:00", warehouseId: wh.id },
    { id: `${wh.id}-shift-afternoon`, name: "Afternoon" as const, start: "14:00", end: "22:00", warehouseId: wh.id },
    { id: `${wh.id}-shift-night`, name: "Night" as const, start: "22:00", end: "06:00", warehouseId: wh.id },
  ])
  .map(
    (s, i) =>
      ({
        ...s,
        workers: workers.filter((w) => w.warehouseId === s.warehouseId && w.shift === s.name).length,
        status: i % 3 === 0 ? "active" : i % 3 === 1 ? "upcoming" : "ended",
      }) satisfies Shift,
  );

// ---------------------------------------------------------------------------
// Purchase orders / receiving / putaway
// ---------------------------------------------------------------------------

export const purchaseOrders: PurchaseOrder[] = Array.from({ length: 56 }, (_, i) => {
  const supplier = pick(rng, suppliers);
  const wh = pick(rng, warehouses);
  const lines = Array.from({ length: intBetween(rng, 1, 5) }, () => {
    const product = pick(rng, products);
    const quantity = intBetween(rng, 20, 600);
    return { sku: product.sku, productName: product.name, quantity, unitCost: product.unitCost };
  });
  const amount = Math.round(lines.reduce((sum, l) => sum + l.quantity * l.unitCost, 0));
  const orderOffset = -intBetween(rng, 2, 40);
  return {
    id: `po-${i + 1}`,
    poNumber: `PO-${pad(20400 + i, 5)}`,
    supplierId: supplier.id,
    warehouseId: wh.id,
    orderDate: daysFromToday(orderOffset),
    expectedDate: daysFromToday(orderOffset + intBetween(rng, 5, 21)),
    items: lines.length,
    amount,
    status: pickWeighted(rng, [
      ["Draft", 1],
      ["Submitted", 2],
      ["Approved", 2],
      ["Partially Received", 2],
      ["Received", 3],
      ["Cancelled", 1],
    ]),
    lines,
  } satisfies PurchaseOrder;
});

function _activityTimeline(steps: [string, number][], _startOffsetHours: number) {
  return steps.map(([label, hOffset], idx) => ({
    id: `evt-${idx}-${label}`,
    label,
    timestamp: daysFromToday(0),
    description: undefined,
    actor: undefined,
    hOffset,
  }));
}

export const receipts: Receipt[] = Array.from({ length: 46 }, (_, i) => {
  const po = purchaseOrders[i % purchaseOrders.length]!;
  const supplier = suppliers.find((s) => s.id === po.supplierId)!;
  const status = pickWeighted<Receipt["status"]>(rng, [
    ["Expected", 2],
    ["Arrived", 2],
    ["Receiving", 1],
    ["Completed", 4],
    ["Exception", 1],
  ]);
  const expectedQuantity = po.lines.reduce((s, l) => s + l.quantity, 0);
  const received =
    status === "Completed" || status === "Exception"
      ? expectedQuantity - intBetween(rng, 0, 15)
      : status === "Receiving"
        ? Math.round(expectedQuantity * floatBetween(rng, 0.3, 0.8))
        : 0;
  return {
    id: `rcpt-${i + 1}`,
    receiptNumber: `RCPT-${pad(50100 + i, 5)}`,
    poNumber: po.poNumber,
    supplierId: supplier.id,
    warehouseId: po.warehouseId,
    dock: pick(rng, DOCKS),
    expectedDate: po.expectedDate,
    actualArrival: status === "Expected" ? null : daysFromToday(-intBetween(rng, 0, 5)),
    items: po.items,
    expectedQuantity,
    receivedQuantity: received,
    damagedQuantity: status === "Exception" ? intBetween(rng, 2, 25) : 0,
    status,
    notes:
      status === "Exception"
        ? "Damaged pallet reported on arrival — awaiting supplier credit note."
        : "No exceptions reported for this receipt.",
    timeline: [
      { id: "t1", label: "Purchase Order Confirmed", timestamp: po.orderDate, actor: "Procurement" },
      { id: "t2", label: "Shipment Expected", timestamp: po.expectedDate, actor: "Supplier" },
      ...(status !== "Expected"
        ? [{ id: "t3", label: "Arrived at Dock", timestamp: daysFromToday(-intBetween(rng, 0, 5)), actor: "Dock Team" }]
        : []),
      ...(status === "Receiving" || status === "Completed" || status === "Exception"
        ? [
            {
              id: "t4",
              label: "Receiving Started",
              timestamp: daysFromToday(-intBetween(rng, 0, 3)),
              actor: "Receiving Clerk",
            },
          ]
        : []),
      ...(status === "Completed" || status === "Exception"
        ? [
            {
              id: "t5",
              label: status === "Exception" ? "Exception Logged" : "Receiving Completed",
              timestamp: daysFromToday(-intBetween(rng, 0, 2)),
              actor: "Warehouse Supervisor",
            },
          ]
        : []),
    ],
  } satisfies Receipt;
});

export const putawayTasks: PutawayTask[] = Array.from({ length: 84 }, (_, i) => {
  const product = pick(rng, products);
  const wh = pick(rng, warehouses);
  const zoneReceiving = zones.find((z) => z.warehouseId === wh.id && z.purpose === "Receiving")!;
  const status = pickWeighted<PutawayTask["status"]>(rng, [
    ["Pending", 3],
    ["Assigned", 2],
    ["In Progress", 2],
    ["Completed", 4],
    ["Exception", 1],
  ]);
  return {
    id: `pw-${i + 1}`,
    taskNumber: `PW-${pad(60100 + i, 5)}`,
    sku: product.sku,
    productName: product.name,
    quantity: intBetween(rng, 10, 400),
    from: `${wh.code}-${zoneReceiving.code}-DOCK`,
    to: locationCodeFor(product),
    priority: pickWeighted(rng, [
      ["Low", 2],
      ["Medium", 4],
      ["High", 3],
      ["Urgent", 1],
    ]),
    assignedWorker: status === "Pending" ? "Unassigned" : fullName(),
    status,
    warehouseId: wh.id,
  } satisfies PutawayTask;
});

// ---------------------------------------------------------------------------
// Orders / picking / packing / shipping / returns
// ---------------------------------------------------------------------------

export const orders: Order[] = Array.from({ length: 128 }, (_, i) => {
  const wh = pick(rng, warehouses);
  const lines = Array.from({ length: intBetween(rng, 1, 6) }, () => {
    const product = pick(rng, products);
    return {
      sku: product.sku,
      productName: product.name,
      quantity: intBetween(rng, 1, 40),
      price: product.sellingPrice,
    };
  });
  const value = Math.round(lines.reduce((s, l) => s + l.quantity * l.price, 0) * 100) / 100;
  const customer = pick(rng, CUSTOMER_NAMES);
  return {
    id: `ord-${i + 1}`,
    orderNumber: `SO-${pad(80200 + i, 5)}`,
    customer,
    date: daysFromToday(-intBetween(rng, 0, 30)),
    items: lines.length,
    quantity: lines.reduce((s, l) => s + l.quantity, 0),
    value,
    priority: pickWeighted(rng, [
      ["Low", 3],
      ["Medium", 5],
      ["High", 3],
      ["Urgent", 1],
    ]),
    warehouseId: wh.id,
    fulfillmentStatus: pickWeighted<Order["fulfillmentStatus"]>(rng, [
      ["Pending", 2],
      ["Allocated", 2],
      ["Picking", 2],
      ["Packing", 1],
      ["Shipped", 3],
      ["Completed", 4],
      ["Cancelled", 1],
    ]),
    paymentStatus: pickWeighted<Order["paymentStatus"]>(rng, [
      ["Paid", 6],
      ["Pending", 2],
      ["Refunded", 1],
      ["Failed", 1],
    ]),
    shippingAddress: `${intBetween(rng, 1, 200)} Industrial Way, ${wh.city}, ${wh.province}`,
    billingAddress: `${intBetween(rng, 1, 200)} Commerce Street, ${wh.city}, ${wh.province}`,
    lines,
  } satisfies Order;
});

export const backorders: Backorder[] = Array.from({ length: 24 }, (_, i) => {
  const order = pick(rng, orders);
  const product = pick(rng, products);
  const requested = intBetween(rng, 20, 300);
  const available = intBetween(rng, 0, requested - 5 > 0 ? requested - 5 : 0);
  return {
    id: `bo-${i + 1}`,
    orderNumber: order.orderNumber,
    customer: order.customer,
    sku: product.sku,
    productName: product.name,
    requestedQuantity: requested,
    available,
    backordered: requested - available,
    expectedDate: daysFromToday(intBetween(rng, 2, 21)),
    priority: pick(rng, ["Low", "Medium", "High", "Urgent"] as const),
    status: pickWeighted(rng, [
      ["Waiting on Supplier", 3],
      ["Partial Allocation", 2],
      ["Ready to Fulfill", 1],
    ]),
  } satisfies Backorder;
});

export const pickTasks: PickTask[] = Array.from({ length: 90 }, (_, i) => {
  const order = orders[i % orders.length]!;
  const wh = warehouses.find((w) => w.id === order.warehouseId)!;
  const zone = zones.find((z) => z.warehouseId === wh.id && z.purpose === "Picking")!;
  const status = pickWeighted<PickTask["status"]>(rng, [
    ["Queued", 3],
    ["Assigned", 2],
    ["In Progress", 2],
    ["Completed", 4],
    ["Exception", 1],
  ]);
  const lines = order.lines.map((line) => {
    const picked =
      status === "Completed" ? line.quantity : status === "In Progress" ? intBetween(rng, 0, line.quantity) : 0;
    return {
      sku: line.sku,
      productName: line.productName,
      location: `${wh.code}-${zone.code}-A${intBetween(rng, 1, 4)}-${pad(intBetween(rng, 1, 20), 2)}-${pad(intBetween(rng, 1, 7), 2)}`,
      quantity: line.quantity,
      picked,
    };
  });
  return {
    id: `pk-${i + 1}`,
    pickListId: `PK-${pad(70300 + i, 5)}`,
    orderNumber: order.orderNumber,
    customer: order.customer,
    priority: order.priority,
    items: lines.length,
    warehouseId: wh.id,
    zone: zone.name,
    worker: status === "Queued" ? "Unassigned" : fullName(),
    created: daysFromToday(-intBetween(rng, 0, 5)),
    status,
    lines,
  } satisfies PickTask;
});

export const packTasks: PackTask[] = Array.from({ length: 62 }, (_, i) => {
  const pickTask = pickTasks[i % pickTasks.length]!;
  const status = pickWeighted<PackTask["status"]>(rng, [
    ["Ready", 3],
    ["Packing", 2],
    ["Packed", 4],
    ["Exception", 1],
  ]);
  return {
    id: `pack-${i + 1}`,
    packingId: `PKG-${pad(75400 + i, 5)}`,
    orderNumber: pickTask.orderNumber,
    customer: pickTask.customer,
    items: pickTask.items,
    packageType: pick(rng, ["Carton — Medium", "Carton — Large", "Pallet", "Poly Mailer", "Crate"]),
    weightKg: floatBetween(rng, 0.8, 220, 1),
    dimensionsCm: `${intBetween(rng, 20, 120)} x ${intBetween(rng, 20, 100)} x ${intBetween(rng, 10, 90)}`,
    station: `Pack Station ${intBetween(rng, 1, 8)}`,
    worker: fullName(),
    status,
  } satisfies PackTask;
});

export const shipments: Shipment[] = Array.from({ length: 68 }, (_, i) => {
  const order = orders[(i * 3) % orders.length]!;
  const wh = warehouses.find((w) => w.id === order.warehouseId)!;
  const status = pickWeighted<Shipment["status"]>(rng, [
    ["Order Confirmed", 1],
    ["Packed", 1],
    ["Dispatched", 2],
    ["In Transit", 3],
    ["Out for Delivery", 1],
    ["Delivered", 5],
    ["Delayed", 1],
  ]);
  const shipOffset = -intBetween(rng, 0, 12);
  return {
    id: `shp-${i + 1}`,
    shipmentNumber: `SHP-${pad(20800 + i, 5)}`,
    orderNumber: order.orderNumber,
    customer: order.customer,
    carrier: pick(rng, CARRIERS),
    trackingNumber: `ZA${intBetween(rng, 100000000, 999999999)}`,
    origin: wh.name,
    destination: `${order.customer} — ${wh.province}`,
    weightKg: floatBetween(rng, 5, 850, 1),
    packages: intBetween(rng, 1, 12),
    shipDate: daysFromToday(shipOffset),
    expectedDelivery: daysFromToday(shipOffset + intBetween(rng, 1, 6)),
    status,
    timeline: [
      { id: "s1", label: "Order Confirmed", timestamp: order.date, actor: "System" },
      { id: "s2", label: "Packed", timestamp: daysFromToday(shipOffset - 1), actor: "Packing Team" },
      ...(status !== "Order Confirmed" && status !== "Packed"
        ? [{ id: "s3", label: "Dispatched", timestamp: daysFromToday(shipOffset), actor: "Shipping" }]
        : []),
      ...(["In Transit", "Out for Delivery", "Delivered", "Delayed"].includes(status)
        ? [{ id: "s4", label: "In Transit", timestamp: daysFromToday(shipOffset + 1), actor: pick(rng, CARRIERS) }]
        : []),
      ...(["Out for Delivery", "Delivered"].includes(status)
        ? [
            {
              id: "s5",
              label: "Out for Delivery",
              timestamp: daysFromToday(shipOffset + 2),
              actor: pick(rng, CARRIERS),
            },
          ]
        : []),
      ...(status === "Delivered"
        ? [{ id: "s6", label: "Delivered", timestamp: daysFromToday(shipOffset + 3), actor: "Recipient" }]
        : []),
      ...(status === "Delayed"
        ? [
            {
              id: "s6d",
              label: "Delivery Delayed",
              timestamp: daysFromToday(shipOffset + 2),
              actor: pick(rng, CARRIERS),
              description: "Weather disruption on route.",
            },
          ]
        : []),
    ],
  } satisfies Shipment;
});

export const returns: ReturnRequest[] = Array.from({ length: 30 }, (_, i) => {
  const order = pick(rng, orders);
  return {
    id: `ret-${i + 1}`,
    returnNumber: `RMA-${pad(90200 + i, 5)}`,
    orderNumber: order.orderNumber,
    customer: order.customer,
    reason: pick(rng, ["Damaged", "Wrong Item", "Defective", "Customer Return", "Other"] as const),
    items: intBetween(rng, 1, 5),
    date: daysFromToday(-intBetween(rng, 0, 20)),
    status: pickWeighted(rng, [
      ["Awaiting Inspection", 3],
      ["Approved", 2],
      ["Rejected", 1],
      ["Completed", 3],
    ]),
  } satisfies ReturnRequest;
});

// ---------------------------------------------------------------------------
// Cycle counts / transfers / adjustments / stock movements
// ---------------------------------------------------------------------------

export const cycleCounts: CycleCount[] = Array.from({ length: 34 }, (_, i) => {
  const wh = pick(rng, warehouses);
  const zone = pick(
    rng,
    zones.filter((z) => z.warehouseId === wh.id),
  );
  const status = pickWeighted<CycleCount["status"]>(rng, [
    ["Scheduled", 3],
    ["In Progress", 2],
    ["Completed", 4],
    ["Variance Review", 1],
  ]);
  const lines = Array.from({ length: intBetween(rng, 3, 9) }, () => {
    const product = pick(rng, products);
    const systemQuantity = intBetween(rng, 20, 500);
    const variance = status === "Scheduled" ? 0 : intBetween(rng, -18, 18);
    return {
      sku: product.sku,
      productName: product.name,
      systemQuantity,
      countedQuantity: Math.max(0, systemQuantity + variance),
    };
  });
  const accuracy =
    status === "Scheduled"
      ? 0
      : Math.round((lines.filter((l) => l.systemQuantity === l.countedQuantity).length / lines.length) * 1000) / 10;
  return {
    id: `cc-${i + 1}`,
    warehouseId: wh.id,
    zone: zone.name,
    location: `${zone.code}-A${intBetween(rng, 1, 4)}-${pad(intBetween(rng, 1, 20), 2)}`,
    scheduledDate: daysFromToday(intBetween(rng, -10, 15)),
    items: lines.length,
    assignedWorker: fullName(),
    accuracy,
    status,
    lines,
  } satisfies CycleCount;
});

export const transfers: Transfer[] = Array.from({ length: 26 }, (_, i) => {
  const source = pick(rng, warehouses);
  let destination = pick(rng, warehouses);
  while (destination.id === source.id) destination = pick(rng, warehouses);
  const lines = Array.from({ length: intBetween(rng, 1, 4) }, () => {
    const product = pick(rng, products);
    return { sku: product.sku, productName: product.name, quantity: intBetween(rng, 10, 300) };
  });
  return {
    id: `trf-${i + 1}`,
    sourceWarehouseId: source.id,
    destinationWarehouseId: destination.id,
    items: lines.length,
    quantity: lines.reduce((s, l) => s + l.quantity, 0),
    requestedBy: fullName(),
    date: daysFromToday(-intBetween(rng, 0, 25)),
    status: pickWeighted(rng, [
      ["Draft", 1],
      ["Requested", 2],
      ["Approved", 2],
      ["In Transit", 2],
      ["Completed", 3],
      ["Cancelled", 1],
    ]),
    lines,
  } satisfies Transfer;
});

export const stockAdjustments: StockAdjustment[] = Array.from({ length: 40 }, (_, i) => {
  const product = pick(rng, products);
  const current = intBetween(rng, 10, 500);
  const delta = intBetween(rng, -30, 30);
  return {
    id: `adj-${i + 1}`,
    sku: product.sku,
    productName: product.name,
    locationCode: locationCodeFor(product),
    currentQuantity: current,
    adjustedQuantity: Math.max(0, current + delta),
    reason: pick(rng, ["Damage", "Count Difference", "Expiration", "Correction", "Other"] as const),
    requestedBy: fullName(),
    date: daysFromToday(-intBetween(rng, 0, 20)),
    status: pickWeighted(rng, [
      ["Pending", 2],
      ["Approved", 6],
      ["Rejected", 1],
    ]),
  } satisfies StockAdjustment;
});

const MOVEMENT_TYPES = ["Receipt", "Putaway", "Pick", "Transfer", "Adjustment", "Return"] as const;

export const stockMovements: StockMovement[] = Array.from({ length: 165 }, (_, i) => {
  const product = pick(rng, products);
  const wh = pick(rng, warehouses);
  const type = pick(rng, MOVEMENT_TYPES);
  const sign = type === "Pick" || type === "Transfer" ? -1 : 1;
  return {
    id: `mv-${i + 1}`,
    date: daysFromToday(-intBetween(rng, 0, 45)),
    sku: product.sku,
    productName: product.name,
    warehouseId: wh.id,
    locationCode: locationCodeFor(product),
    quantity: sign * intBetween(rng, 5, 400),
    type,
    reference:
      type === "Receipt"
        ? pick(rng, receipts).receiptNumber
        : type === "Pick"
          ? pick(rng, pickTasks).pickListId
          : type === "Transfer"
            ? `TRF-${pad(intBetween(rng, 1, 26), 4)}`
            : type === "Putaway"
              ? pick(rng, putawayTasks).taskNumber
              : type === "Return"
                ? pick(rng, returns).returnNumber
                : `ADJ-${pad(intBetween(rng, 1, 40), 4)}`,
    user: fullName(),
  } satisfies StockMovement;
});

// ---------------------------------------------------------------------------
// Logistics
// ---------------------------------------------------------------------------

export const carriers: Carrier[] = CARRIERS.map(
  (name, i) =>
    ({
      id: `car-${i + 1}`,
      name,
      shipments: shipments.filter((s) => s.carrier === name).length,
      onTimeRate: floatBetween(rng, 88, 99, 1),
      avgDeliveryDays: floatBetween(rng, 1.2, 4.8, 1),
      status: "active",
    }) satisfies Carrier,
);

export const routes: DeliveryRoute[] = Array.from({ length: 22 }, (_, i) => {
  const wh = pick(rng, warehouses);
  const dest = pick(rng, CUSTOMER_NAMES);
  const depOffset = -intBetween(rng, 0, 6);
  return {
    id: `route-${i + 1}`,
    routeId: `RT-${pad(4400 + i, 4)}`,
    origin: wh.name,
    destination: `${dest} — ${pick(rng, warehouses).province}`,
    stops: intBetween(rng, 2, 9),
    shipments: intBetween(rng, 3, 18),
    driver: fullName(),
    vehicle: `${pick(rng, ["Isuzu FTR", "Hino 500", "Mercedes Actros", "Scania P-series", "MAN TGM"])} — ${pad(intBetween(rng, 1, 40), 2)}`,
    departure: daysFromToday(depOffset),
    eta: daysFromToday(depOffset + intBetween(rng, 0, 2)),
    status: pickWeighted(rng, [
      ["Scheduled", 2],
      ["En Route", 3],
      ["Completed", 4],
      ["Delayed", 1],
    ]),
  } satisfies DeliveryRoute;
});

// ---------------------------------------------------------------------------
// Warehouse tasks (task board), reports, notifications
// ---------------------------------------------------------------------------

const TASK_TYPES = ["Receiving", "Putaway", "Picking", "Packing", "Cycle Count", "Transfer", "Loading"] as const;

export const warehouseTasks: WarehouseTask[] = Array.from({ length: 110 }, (_, i) => {
  const created = -intBetween(rng, 0, 10);
  return {
    id: `wt-${i + 1}`,
    taskNumber: `TSK-${pad(30500 + i, 5)}`,
    type: pick(rng, TASK_TYPES),
    priority: pickWeighted(rng, [
      ["Low", 2],
      ["Medium", 4],
      ["High", 3],
      ["Urgent", 1],
    ]),
    location: pick(rng, bins).code,
    worker: rng() > 0.15 ? fullName() : "Unassigned",
    created: daysFromToday(created),
    due: daysFromToday(created + intBetween(rng, 1, 4)),
    status: pickWeighted(rng, [
      ["Queued", 2],
      ["Assigned", 2],
      ["In Progress", 2],
      ["Review", 1],
      ["Completed", 4],
    ]),
  } satisfies WarehouseTask;
});

export const reports: Report[] = [
  {
    name: "Inventory Valuation Report",
    description: "Opening/closing stock, movement and value by SKU and warehouse.",
    category: "Inventory",
  },
  {
    name: "Stock Aging Report",
    description: "Identify slow-moving and dead stock across all warehouses.",
    category: "Inventory",
  },
  {
    name: "Receiving Accuracy Report",
    description: "Expected vs received quantities and exception rates by supplier.",
    category: "Receiving",
  },
  {
    name: "Picking Productivity Report",
    description: "Units picked per hour, accuracy and average pick time by worker.",
    category: "Picking",
  },
  {
    name: "Packing Exception Report",
    description: "Packing errors, damages and station throughput.",
    category: "Packing",
  },
  {
    name: "Shipment Performance Report",
    description: "On-time delivery, carrier performance and delay analysis.",
    category: "Shipping",
  },
  {
    name: "Warehouse Utilization Report",
    description: "Capacity, occupancy and zone-level utilization trends.",
    category: "Warehouse Operations",
  },
  {
    name: "Worker Productivity Report",
    description: "Tasks completed, accuracy and productivity score by worker.",
    category: "Productivity",
  },
  {
    name: "Supplier Scorecard",
    description: "On-time delivery, order accuracy and defect rate by supplier.",
    category: "Suppliers",
  },
  {
    name: "Order Fulfillment Report",
    description: "Orders picked, packed, shipped and delivered with cycle time.",
    category: "Fulfillment",
  },
  {
    name: "Cycle Count Variance Report",
    description: "System vs counted quantities and variance by location.",
    category: "Inventory",
  },
  {
    name: "Dock-to-Stock Report",
    description: "Time from dock arrival to putaway completion by warehouse.",
    category: "Warehouse Operations",
  },
].map((r, i) => ({ id: `rpt-${i + 1}`, lastUpdated: daysFromToday(-intBetween(rng, 0, 6)), ...r }) satisfies Report);

export const notifications: Notification[] = [
  { message: "SKU-10482 is below reorder level.", severity: "warning" as const, link: "/inventory" },
  { message: "PO-20482 has arrived at Dock 03.", severity: "info" as const, link: "/receiving" },
  { message: "12 orders are awaiting picking.", severity: "info" as const, link: "/picking" },
  { message: "Shipment SHP-20842 has been delayed.", severity: "danger" as const, link: "/shipping" },
  { message: "Cycle count variance detected in Zone C03.", severity: "warning" as const, link: "/cycle-counts" },
  { message: "Receiving exception logged for RCPT-50118.", severity: "danger" as const, link: "/receiving" },
  { message: "Transfer TRF-0014 has been approved.", severity: "success" as const, link: "/transfers" },
  {
    message: "Worker productivity target exceeded in Durban Fulfillment Centre.",
    severity: "success" as const,
    link: "/productivity",
  },
  {
    message: "Backorder created for SKU-10516 — supplier lead time 14 days.",
    severity: "warning" as const,
    link: "/backorders",
  },
  {
    message: "Packing station 4 reported a scale calibration exception.",
    severity: "danger" as const,
    link: "/packing",
  },
  {
    message: "Purchase order PO-20501 approved by Procurement.",
    severity: "success" as const,
    link: "/purchase-orders",
  },
  { message: "New return request RMA-90212 awaiting inspection.", severity: "info" as const, link: "/returns" },
  {
    message: "Warehouse utilization in Pretoria Logistics Hub exceeds 90%.",
    severity: "warning" as const,
    link: "/warehouses",
  },
  {
    message: "Shift handover completed for Night shift — Johannesburg DC.",
    severity: "info" as const,
    link: "/shifts",
  },
  {
    message: "Carrier SwiftLine Logistics on-time rate improved to 97.2%.",
    severity: "success" as const,
    link: "/carriers",
  },
  { message: "18 pick lists queued in Zone C03 Picking.", severity: "info" as const, link: "/picking" },
].map(
  (n, i) =>
    ({
      id: `notif-${i + 1}`,
      timestamp: daysFromToday(-Math.floor(i / 3)),
      read: i > 5,
      ...n,
    }) satisfies Notification,
);
