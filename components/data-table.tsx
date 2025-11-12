"use client"

import { useMemo, useState } from "react"
import type { DataPoint } from "@/lib/types"

interface DataTableProps {
  data: DataPoint[]
  pageSize?: number
}

export function DataTable({ data, pageSize = 50 }: DataTableProps) {
  const [page, setPage] = useState(0)

  const paginatedData = useMemo(() => {
    const start = page * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  const totalPages = Math.ceil(data.length / pageSize)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Timestamp</th>
              <th className="px-4 py-2 text-left font-semibold">Value</th>
              <th className="px-4 py-2 text-left font-semibold">Category</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((point, i) => (
              <tr key={i} className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-2">{new Date(point.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-2 text-right font-mono">{point.value.toFixed(2)}</td>
                <td className="px-4 py-2">{point.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/50">
          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages} ({data.length} total rows)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-2 py-1 border border-border rounded text-xs disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="px-2 py-1 border border-border rounded text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
