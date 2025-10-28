"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryStates, parseAsInteger } from "nuqs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

const paginationParams = {
  pageIndex: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
};

interface ServerDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  className?: string;
  pagination: {
    totalCount: number;
    totalPages: number;
  };
  pageSizeOptions?: number[];
}

export function ServerDataTable<TData, TValue>(
  props: ServerDataTableProps<TData, TValue>,
) {
  const {
    columns,
    data,
    pagination,
    onRowClick,
    className,
    pageSizeOptions = [20, 30, 40, 50],
  } = props;

  const [paginationState, setPaginationState] =
    useQueryStates(paginationParams);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: pagination.totalCount,
    pageCount: pagination.totalPages,
    state: {
      pagination: paginationState,
    },
    onPaginationChange: (updater) => {
      void setPaginationState(updater, { shallow: false });
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-clip rounded-lg border shadow-md">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-gray-50",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 px-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center space-x-2 sm:justify-start">
          <p className="text-sm font-medium">Rows per page:</p>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center text-sm font-medium sm:w-[100px]">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            className="hidden sm:inline-flex"
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 sm:px-3"
          >
            <span className="sm:hidden">{"<"}</span>
            <span className="hidden sm:inline">{"Previous"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 sm:px-3"
          >
            <span className="sm:hidden">{">"}</span>
            <span className="hidden sm:inline">{"Next"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            className="hidden sm:inline-flex"
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}
