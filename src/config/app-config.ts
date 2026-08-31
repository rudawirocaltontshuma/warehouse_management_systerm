const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Dimension WMS",
  tagline: "Warehouse Management Platform",
  version: "1.0.0",
  copyright: `© ${currentYear}, Dimension WMS. Portfolio demonstration.`,
  meta: {
    title: "Dimension WMS — Warehouse Management Platform",
    description:
      "Dimension WMS is a frontend-only warehouse management system demonstration built with Next.js, TypeScript, Tailwind CSS and shadcn/ui. It showcases receiving, putaway, picking, packing, shipping, inventory and analytics workflows using fictional local mock data.",
  },
};
