import { products, suppliers, warehouses } from "./wms/generate";
import { createRng, daysFromToday, floatBetween, intBetween } from "./wms/rng";

const rng = createRng(4242);

export const inventoryTurnover = Array.from({ length: 12 }, (_, i) => ({
  month: daysFromToday(-30 * (11 - i)).slice(0, 7),
  turnover: floatBetween(rng, 3.2, 6.8, 1),
}));

export const inventoryValueTrend = Array.from({ length: 12 }, (_, i) => ({
  month: daysFromToday(-30 * (11 - i)).slice(0, 7),
  value: intBetween(rng, 15200000, 19800000),
}));

export const stockAging = [
  { bucket: "0-30 days", units: intBetween(rng, 60000, 90000) },
  { bucket: "31-60 days", units: intBetween(rng, 30000, 60000) },
  { bucket: "61-90 days", units: intBetween(rng, 12000, 28000) },
  { bucket: "91-180 days", units: intBetween(rng, 6000, 15000) },
  { bucket: "180+ days", units: intBetween(rng, 1500, 6000) },
];

export const slowMovingItems = [...products]
  .sort((a, b) => a.units - b.units)
  .slice(0, 8)
  .map((p) => ({ sku: p.sku, name: p.name, units: p.units, daysOnHand: intBetween(rng, 90, 260) }));

export const fastMovingItems = [...products]
  .sort((a, b) => b.units - a.units)
  .slice(0, 8)
  .map((p) => ({ sku: p.sku, name: p.name, units: p.units, turnoverRate: floatBetween(rng, 6, 14, 1) }));

export const deadStockValue = Math.round(
  [...products].filter((p) => p.units < 15).reduce((sum, p) => sum + p.units * p.unitCost, 0),
);

export const ordersPerDay = Array.from({ length: 14 }, (_, i) => ({
  day: daysFromToday(-13 + i).slice(5),
  orders: intBetween(rng, 850, 1450),
}));

export const fulfillmentMetrics = {
  avgFulfillmentHours: floatBetween(rng, 6, 18, 1),
  pickAccuracy: floatBetween(rng, 97, 99.6, 1),
  packAccuracy: floatBetween(rng, 96, 99.4, 1),
  shipmentDelays: intBetween(rng, 8, 24),
  completionRate: floatBetween(rng, 92, 98.5, 1),
};

export const warehouseAnalyticsMetrics = warehouses.map((w) => ({
  name: w.code,
  turnover: floatBetween(rng, 3.5, 7.2, 1),
  fulfillment: floatBetween(rng, 90, 99, 1),
  pickAccuracy: floatBetween(rng, 96, 99.7, 1),
  receivingAccuracy: floatBetween(rng, 95, 99.5, 1),
  utilization: Math.round((w.usedCapacity / w.totalCapacity) * 1000) / 10,
  dockToStockHours: floatBetween(rng, 2.5, 9, 1),
}));

export const supplierPerformanceTrend = Array.from({ length: 8 }, (_, i) => ({
  month: daysFromToday(-30 * (7 - i)).slice(0, 7),
  onTime: floatBetween(rng, 84, 98, 1),
  accuracy: floatBetween(rng, 88, 99, 1),
}));

export const topSuppliersBySpend = [...suppliers].sort((a, b) => b.spend - a.spend).slice(0, 8);
