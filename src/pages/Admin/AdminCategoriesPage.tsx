import React from 'react';
import { DataTable } from '@/components/common';
import { ROWS_PER_PAGE_OPTIONS } from '@/constants';

type Category = { id: number; name: string; description: string };

const AdminCategoriesPage: React.FC = () => {
  // Mock categories data
  const allCategories = React.useMemo<Category[]>(() => {
    return Array.from({ length: 42 }).map((_, index) => ({
      id: index + 1,
      name: `Category ${index + 1}`,
      description: `Description ${index + 1}`,
    }));
  }, []);

  const [page, setPage] = React.useState<number>(1); // 1-based
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Category | null>('name');
  const [search, setSearch] = React.useState<string>('');

  // Filter by search
  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allCategories;
    return allCategories.filter(
      (c) => c.name.toLowerCase().includes(term) || c.description.toLowerCase().includes(term)
    );
  }, [allCategories, search]);

  // Sort
  const sorted = React.useMemo(() => {
    if (!orderBy) return filtered;
    const data = [...filtered];
    data.sort((a, b) => {
      const av = a[orderBy];
      const bv = b[orderBy];
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'asc' ? av - bv : bv - av;
      }
      return order === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return data;
  }, [filtered, order, orderBy]);

  // Paginate
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, rowsPerPage)));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageRows = sorted.slice(start, end);

  const handleRequestSort = (property: keyof Category) => {
    if (orderBy === property) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(property);
      setOrder('asc');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <p className="text-gray-600">Manage categories here.</p>
      <DataTable<Category>
        title="Categories"
        columns={[
          { id: 'id', label: 'ID', sortable: true },
          { id: 'name', label: 'Name', sortable: true },
          { id: 'description', label: 'Description', sortable: true },
        ]}
        rows={pageRows}
        total={total}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp);
          setPage(1);
        }}
        checkboxSelection={false}
        selectedIds={[]}
        onSelectAllClick={() => {}}
        onRowClick={() => {}}
        searchable={true}
        searchPlaceholder="Search categories"
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
    </div>
  );
};

export default AdminCategoriesPage;


