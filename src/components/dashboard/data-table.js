"use client";

import { useMemo, useState } from "react";
import Icon from "../icon";

export default function DataTable({
  columns,
  rows,
  rowKey = "id",
  searchPlaceholder = "Cari data...",
  filterOptions = [],
  emptyTitle = "Belum ada data",
  emptyDescription = "Data demonstrasi akan ditampilkan di sini.",
  pageSize = 6,
  onRowClick,
  toolbar,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const activeFilter = filterOptions.find((option) => option.value === filter);
    const matches = rows.filter((row) => {
      const matchesSearch =
        !query ||
        columns.some((column) =>
          String(column.value ? column.value(row) : row[column.key] ?? "")
            .toLowerCase()
            .includes(query),
        );
      const matchesFilter =
        !filter ||
        !activeFilter ||
        String(row[activeFilter.key] ?? "") === filter;

      return matchesSearch && matchesFilter;
    });

    if (!sortKey) return matches;

    return [...matches].sort((a, b) => {
      const column = columns.find((item) => item.key === sortKey);
      const left = String(column?.value ? column.value(a) : a[sortKey] ?? "");
      const right = String(column?.value ? column.value(b) : b[sortKey] ?? "");
      const leftNumber = Number(left.replace(/[^\d]/g, ""));
      const rightNumber = Number(right.replace(/[^\d]/g, ""));
      const comparison =
        Number.isFinite(leftNumber) &&
        Number.isFinite(rightNumber) &&
        left !== "" &&
        right !== ""
          ? leftNumber - rightNumber
          : left.localeCompare(right, "id");
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [columns, filter, filterOptions, rows, search, sortDirection, sortKey]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const currentPage = Math.min(page, Math.max(totalPages - 1, 0));
  const visibleRows = filteredRows.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );

  function updateSearch(value) {
    setSearch(value);
    setPage(0);
  }

  function updateFilter(value) {
    setFilter(value);
    setPage(0);
  }

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  return (
    <section className="dashboard-table-card">
      <div className="table-toolbar">
        <label className="table-search">
          <Icon name="search" size={16} />
          <input
            type="search"
            value={search}
            placeholder={searchPlaceholder}
            onChange={(event) => updateSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              className="table-clear-search"
              aria-label="Hapus pencarian"
              onClick={() => updateSearch("")}
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </label>
        <div className="table-toolbar-actions">
          {filterOptions.length > 0 && (
            <label className="table-filter">
              <Icon name="filter" size={15} />
              <select
                aria-label="Filter tabel"
                value={filter}
                onChange={(event) => updateFilter(event.target.value)}
              >
                <option value="">Semua data</option>
                {filterOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" size={14} />
            </label>
          )}
          {toolbar}
        </div>
      </div>

      <div className="table-scroll-region">
        <table className="dashboard-data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  {column.sortable === false ? (
                    column.label
                  ) : (
                    <button
                      type="button"
                      className="table-sort-button"
                      onClick={() => toggleSort(column.key)}
                      aria-label={`Urutkan berdasarkan ${column.label}`}
                    >
                      {column.label}
                      <Icon
                        name={
                          sortKey === column.key && sortDirection === "desc"
                            ? "arrow-down-right"
                            : "arrow-up-right"
                        }
                        size={12}
                      />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <tr
                  key={row[rowKey]}
                  className={onRowClick ? "table-row-clickable" : ""}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render
                        ? column.render(row)
                        : (column.value
                            ? column.value(row)
                            : row[column.key]) ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="table-empty-cell" colSpan={columns.length}>
                  <span className="table-empty-icon">
                    <Icon name="search" size={21} />
                  </span>
                  <strong>{emptyTitle}</strong>
                  <small>{emptyDescription}</small>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <span className="table-count">
          Menampilkan{" "}
          <strong>{filteredRows.length ? currentPage * pageSize + 1 : 0}</strong>
          –<strong>{Math.min((currentPage + 1) * pageSize, filteredRows.length)}</strong>{" "}
          dari <strong>{filteredRows.length}</strong> data
        </span>
        <div className="pagination-controls" aria-label="Navigasi halaman tabel">
          <button
            className="pagination-button"
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            <Icon name="chevron-left" size={16} />
          </button>
          <span>
            Halaman {totalPages ? currentPage + 1 : 0} / {totalPages}
          </span>
          <button
            className="pagination-button"
            type="button"
            aria-label="Halaman berikutnya"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage(currentPage + 1)}
          >
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
