import { inventory, orders, pickTasks, products, receipts, shipments, warehouses, workers } from "./wms/generate";
import { daysFromToday } from "./wms/rng";

export const dashboardKpis = {
  totalInventoryUnits: inventory.reduce((sum, i) => sum + i.onHand, 0),
  inventoryValue: products.reduce((sum, p) => sum + p.units * p.unitCost, 0),
  ordersToday: orders.filter((o) => o.date === daysFromToday(0)).length || 1284,
  ordersPending: orders.filter((o) => o.fulfillmentStatus === "Pending" || o.fulfillmentStatus === "Allocated").length,
  inboundShipments: warehouses.reduce((sum, w) => sum + w.inbound, 0),
  outboundShipments: warehouses.reduce((sum, w) => sum + w.outbound, 0),
  lowStockItems: inventory.filter((i) => i.status === "low-stock").length,
  utilization:
    Math.round(
      (warehouses.reduce((sum, w) => sum + w.usedCapacity, 0) /
        warehouses.reduce((sum, w) => sum + w.totalCapacity, 0)) *
        1000,
    ) / 10,
};

export const fulfillmentTrend = Array.from({ length: 14 }, (_, i) => {
  const day = daysFromToday(-13 + i).slice(5);
  return {
    day,
    fulfilled: 780 + Math.round(Math.sin(i / 2) * 90 + i * 6),
    target: 900,
  };
});

export const inboundOutbound = Array.from({ length: 7 }, (_, i) => {
  const day = daysFromToday(-6 + i).slice(5);
  return {
    day,
    inbound: 30 + Math.round(Math.sin(i) * 10 + i * 2),
    outbound: 55 + Math.round(Math.cos(i) * 12 + i * 3),
  };
});

export const utilizationByWarehouse = warehouses.map((w) => ({
  name: w.code,
  utilization: Math.round((w.usedCapacity / w.totalCapacity) * 1000) / 10,
}));

export const inventoryByCategory = (() => {
  const map = new Map<string, number>();
  for (const p of products) {
    map.set(p.category, (map.get(p.category) ?? 0) + p.units);
  }
  return Array.from(map, ([name, value]) => ({ name, value }));
})();

export const pickingProductivity = workers
  .filter((w) => w.department === "Picking")
  .slice(0, 8)
  .map((w) => ({ name: w.name.split(" ")[0]!, units: w.tasksCompleted }));

export const shipmentStatusBreakdown = (() => {
  const map = new Map<string, number>();
  for (const s of shipments) {
    map.set(s.status, (map.get(s.status) ?? 0) + 1);
  }
  return Array.from(map, ([name, value]) => ({ name, value }));
})();

export const dailyActivity = Array.from({ length: 14 }, (_, i) => {
  const day = daysFromToday(-13 + i).slice(5);
  return {
    day,
    receiving: 20 + Math.round(Math.sin(i / 3) * 8 + i),
    picking: 60 + Math.round(Math.cos(i / 2) * 15 + i * 2),
    shipping: 45 + Math.round(Math.sin(i / 2.5) * 10 + i),
  };
});

export const recentActivity = [
  ...receipts.slice(0, 3).map((r) => ({ label: `Receipt ${r.receiptNumber} — ${r.status}`, time: r.expectedDate })),
  ...pickTasks.slice(0, 3).map((p) => ({ label: `Pick list ${p.pickListId} — ${p.status}`, time: p.created })),
  ...shipments.slice(0, 3).map((s) => ({ label: `Shipment ${s.shipmentNumber} — ${s.status}`, time: s.shipDate })),
].sort((a, b) => (a.time < b.time ? 1 : -1));

export const topMovingProducts = [...products]
  .sort((a, b) => b.units - a.units)
  .slice(0, 6)
  .map((p) => ({ sku: p.sku, name: p.name, units: p.units, category: p.category }));

export const workerProductivitySummary = {
  activeWorkers: workers.filter((w) => w.status === "Active").length,
  avgProductivity: Math.round(workers.reduce((s, w) => s + w.productivity, 0) / workers.length),
  avgAccuracy: Math.round((workers.reduce((s, w) => s + w.accuracy, 0) / workers.length) * 10) / 10,
};
