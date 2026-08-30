"use client";

import { type ReactNode, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowUpDown, Download, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { EmptyState } from "./empty-state";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
}

export interface DataTableFilter<T> {
  id: string;
  label: string;
  options: string[];
  accessor: (row: T) => string;
}

export function DataTable<T>({
  rows,
  columns,
  filters = [],
  searchPlaceholder = "Search…",
  searchAccessor,
  onRowClick,
  pageSize = 10,
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or filters.",
}: {
  rows: T[];
  columns: DataTableColumn<T>[];
  filters?: DataTableFilter<T>[];
  searchPlaceholder?: string;
  searchAccessor: (row: T) => string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const _router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortId, setSortId] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((r) => searchAccessor(r).toLowerCase().includes(q));
    }
    for (const filter of filters) {
      const value = activeFilters[filter.id];
      if (value && value !== "all") {
        result = result.filter((r) => filter.accessor(r) === value);
      }
    }
    if (sortId) {
      const col = columns.find((c) => c.id === sortId);
      const sortFn = col?.sortValue;
      if (sortFn) {
        result = [...result].sort((a, b) => {
          const av = sortFn(a);
          const bv = sortFn(b);
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }
    return result;
  }, [rows, query, activeFilters, filters, sortId, sortDir, columns, searchAccessor]);

  const pageCount = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (id: string) => {
    if (sortId === id) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortId(id);
      setSortDir("asc");
    }
    setPage(1);
  };

  const FilterControls = (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Select
          key={filter.id}
          value={activeFilters[filter.id] ?? "all"}
          onValueChange={(value) => {
            setActiveFilters((prev) => ({ ...prev, [filter.id]: value }));
            setPage(1);
            toast.success("Filters applied.");
          }}
        >
          <SelectTrigger size="sm" className="w-full sm:w-40">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filter.label}</SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex">{filters.length > 0 && FilterControls}</div>
          {filters.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="sm:hidden">
                  <SlidersHorizontal data-icon="inline-start" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 px-4 pb-4">{FilterControls}</div>
              </SheetContent>
            </Sheet>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Export preview prepared.", { description: "This demo does not generate a real file." })
            }
          >
            <Download data-icon="inline-start" />
            <span className="hidden sm:inline">Export Preview</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.id} className={col.className}>
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.id)}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      {col.header}
                      <ArrowUpDown className="size-3" aria-hidden />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((row, i) => (
                <TableRow
                  key={i}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 p-0">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-muted-foreground text-xs">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function useRowNavigation(basePath: string) {
  const router = useRouter();
  return (id: string) => router.push(`${basePath}/${id}`);
}
