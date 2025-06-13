"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  Table as TanstackTable,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Tagihan {
  id: string;
  santriId: string;
  jenisTagihanId: string;
  amount: number;
  dueDate: Date;
  status: "pending" | "paid" | "overdue";
  description?: string;
  santri: {
    id: string;
    name: string;
    santriId: string;
    kelas: {
      name: string;
      level?: string;
    };
  };
  jenisTagihan: {
    id: string;
    name: string;
  };
}

interface JenisTagihan {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

interface Santri {
  id: string;
  name: string;
  santriId: string;
  kelas: {
    id: string;
    name: string;
    level?: string;
  };
}

const tagihanFormSchema = z.object({
  santriId: z.string().uuid("Pilih santri yang valid"),
  jenisTagihanId: z.string().uuid("Pilih jenis tagihan yang valid"),
  amount: z.coerce.number().min(0, "Jumlah harus lebih dari atau sama dengan 0"),
  dueDate: z.string().min(1, "Tanggal jatuh tempo harus diisi"),
  description: z.string().optional(),
});

export default function TagihanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // State hooks
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTagihan, setEditingTagihan] = React.useState<Tagihan | null>(null);
  const [deletingTagihanId, setDeletingTagihanId] = React.useState<string | null>(null);
  const [showingDetailTagihan, setShowingDetailTagihan] = React.useState<Tagihan | null>(null);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Form hook
  const form = useForm<z.infer<typeof tagihanFormSchema>>({
    resolver: zodResolver(tagihanFormSchema),
    defaultValues: {
      santriId: "",
      jenisTagihanId: "",
      amount: 0,
      dueDate: "",
      description: "",
    },
  });

  // Query hooks
  const {
    data: tagihanData,
    isLoading: isLoadingTagihan,
    error: errorTagihan,
  } = useQuery<Tagihan[]>({ 
    queryKey: ["tagihan"], 
    queryFn: () => fetch("/api/tagihan").then((res) => res.json()) 
  });

  const {
    data: jenisTagihanData,
    isLoading: isLoadingJenisTagihan,
    error: errorJenisTagihan,
  } = useQuery<JenisTagihan[]>({ 
    queryKey: ["jenis-tagihan"], 
    queryFn: () => fetch("/api/jenis-tagihan").then((res) => res.json()) 
  });

  const {
    data: santriData,
    isLoading: isLoadingSantri,
    error: errorSantri,
  } = useQuery<Santri[]>({ 
    queryKey: ["santri"], 
    queryFn: () => fetch("/api/santri").then((res) => res.json()) 
  });

  // Mutation hooks
  const addTagihanMutation = useMutation({
    mutationFn: (newTagihan: z.infer<typeof tagihanFormSchema>) =>
      fetch("/api/tagihan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTagihan),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagihan"] });
      setIsDialogOpen(false);
      setEditingTagihan(null);
      form.reset();
      toast.success("Tagihan berhasil ditambahkan");
    },
  });

  const updateTagihanMutation = useMutation({
    mutationFn: async (updatedTagihan: Partial<Tagihan> & { id: string }) => {
      const response = await fetch(`/api/tagihan/${updatedTagihan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          santriId: updatedTagihan.santriId,
          jenisTagihanId: updatedTagihan.jenisTagihanId,
          amount: updatedTagihan.amount,
          dueDate: updatedTagihan.dueDate,
          description: updatedTagihan.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal memperbarui tagihan");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagihan"] });
      setIsDialogOpen(false);
      setEditingTagihan(null);
      form.reset();
      toast.success("Tagihan berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteTagihanMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/tagihan/${id}`, {
        method: "DELETE",
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagihan"] });
      setDeletingTagihanId(null);
      toast.success("Tagihan berhasil dihapus");
    },
  });

  // Effect hooks
  React.useEffect(() => {
    if (editingTagihan) {
      form.reset({
        santriId: editingTagihan.santriId,
        jenisTagihanId: editingTagihan.jenisTagihanId,
        amount: editingTagihan.amount,
        dueDate: new Date(editingTagihan.dueDate).toISOString().split('T')[0],
        description: editingTagihan.description || "",
      });
    } else {
      form.reset();
    }
  }, [editingTagihan, form]);

  // Table configuration
  const columns: ColumnDef<Tagihan>[] = [
    {
      id: "select",
      header: ({ table }: { table: TanstackTable<Tagihan> }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: Row<Tagihan> }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "no",
      header: "No",
      cell: ({ row }: { row: Row<Tagihan> }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "santri",
      header: "Santri",
      cell: ({ row }: { row: Row<Tagihan> }) => (
        <div>
          <div className="font-medium">{row.original.santri.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.santri.kelas.name} {row.original.santri.kelas.level ? `(${row.original.santri.kelas.level})` : ""}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "jenisTagihan",
      header: "Jenis Tagihan",
      cell: ({ row }: { row: Row<Tagihan> }) => (
        <div className="capitalize">{row.original.jenisTagihan.name}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Jumlah",
      cell: ({ row }: { row: Row<Tagihan> }) => (
        <div>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(row.getValue<number>("amount"))}
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Jatuh Tempo",
      cell: ({ row }: { row: Row<Tagihan> }) => (
        <div>
          {new Date(row.getValue<Date>("dueDate")).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: Row<Tagihan> }) => {
        const status = row.getValue<string>("status");
        const statusColors = {
          pending: "bg-yellow-100 text-yellow-800",
          paid: "bg-green-100 text-green-800",
          overdue: "bg-red-100 text-red-800",
        };
        const statusLabels = {
          pending: "Menunggu",
          paid: "Lunas",
          overdue: "Terlambat",
        };
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
            {statusLabels[status as keyof typeof statusLabels]}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Tagihan> }) => {
        const tagihan = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditTagihan(tagihan)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => confirmDeleteTagihan(tagihan.id)}>Hapus</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDetailTagihan(tagihan)}>Detail</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable<Tagihan>({
    data: tagihanData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Handler functions
  async function onSubmit(values: z.infer<typeof tagihanFormSchema>) {
    try {
      if (editingTagihan) {
        await updateTagihanMutation.mutateAsync({
          id: editingTagihan.id,
          ...values,
          dueDate: new Date(values.dueDate),
        });
      } else {
        await addTagihanMutation.mutateAsync(values);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data");
    }
  }

  const handleAddTagihan = () => {
    setEditingTagihan(null);
    form.reset({
      santriId: "",
      jenisTagihanId: "",
      amount: 0,
      dueDate: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditTagihan = (tagihan: Tagihan) => {
    setEditingTagihan(tagihan);
    form.reset({
      santriId: tagihan.santriId,
      jenisTagihanId: tagihan.jenisTagihanId,
      amount: tagihan.amount,
      dueDate: new Date(tagihan.dueDate).toISOString().split('T')[0],
      description: tagihan.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTagihan(null);
    form.reset({
      santriId: "",
      jenisTagihanId: "",
      amount: 0,
      dueDate: "",
      description: "",
    });
  };

  const confirmDeleteTagihan = (id: string) => {
    setDeletingTagihanId(id);
  };

  const handleDeleteConfirm = () => {
    if (deletingTagihanId) {
      deleteTagihanMutation.mutate(deletingTagihanId);
    }
  };

  const handleDetailTagihan = (tagihan: Tagihan) => {
    setShowingDetailTagihan(tagihan);
  };

  if (isLoadingTagihan || isLoadingJenisTagihan || isLoadingSantri) return <div>Memuat data...</div>;
  if (errorTagihan || errorJenisTagihan || errorSantri) return <div>Terjadi kesalahan saat memuat data</div>;

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0 mt-6">
          <header className="flex h-14 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <AppSidebar />
                </SheetContent>
              </Sheet>
              <Separator orientation="vertical" className="h-8 hidden md:block" />
              <div className="flex flex-col">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Tagihan</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <h2 className="text-3xl font-bold tracking-tight">Tagihan</h2>
              </div>
            </div>
            <Button onClick={handleAddTagihan}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Tagihan
            </Button>
          </header>
          <div className="flex-1 space-y-6">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter tagihan..."
                value={(table.getColumn("santri")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("santri")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        Tidak ada hasil.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} dari{" "}
                {table.getFilteredRowModel().rows.length} baris yang dipilih.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTagihan ? "Edit Tagihan" : "Tambah Tagihan"}
              </DialogTitle>
              <DialogDescription>
                {editingTagihan
                  ? "Ubah informasi tagihan yang ada"
                  : "Tambahkan tagihan baru ke sistem"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="santriId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Santri</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih santri" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {santriData?.map((santri) => (
                            <SelectItem key={santri.id} value={santri.id}>
                              {santri.name} - {santri.kelas.name} {santri.kelas.level ? `(${santri.kelas.level})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jenisTagihanId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Tagihan</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedJenisTagihan = jenisTagihanData?.find(jt => jt.id === value);
                          if (selectedJenisTagihan) {
                            form.setValue("amount", selectedJenisTagihan.amount);
                          }
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis tagihan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jenisTagihanData?.map((jenisTagihan) => (
                            <SelectItem key={jenisTagihan.id} value={jenisTagihan.id}>
                              {jenisTagihan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan jumlah"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan deskripsi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={addTagihanMutation.isPending || updateTagihanMutation.isPending}
                  >
                    {editingTagihan ? "Simpan Perubahan" : "Tambah"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!showingDetailTagihan} onOpenChange={() => setShowingDetailTagihan(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detail Tagihan</DialogTitle>
              <DialogDescription>
                Informasi lengkap mengenai tagihan.
              </DialogDescription>
            </DialogHeader>
            {showingDetailTagihan && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Santri</div>
                  <div className="col-span-3">
                    <div className="font-medium">{showingDetailTagihan.santri.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {showingDetailTagihan.santri.kelas.name} {showingDetailTagihan.santri.kelas.level ? `(${showingDetailTagihan.santri.kelas.level})` : ""}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Jenis Tagihan</div>
                  <div className="col-span-3">{showingDetailTagihan.jenisTagihan.name}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Jumlah</div>
                  <div className="col-span-3">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(showingDetailTagihan.amount)}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Jatuh Tempo</div>
                  <div className="col-span-3">
                    {new Date(showingDetailTagihan.dueDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Status</div>
                  <div className="col-span-3">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      showingDetailTagihan.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      showingDetailTagihan.status === "paid" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {showingDetailTagihan.status === "pending" ? "Menunggu" :
                       showingDetailTagihan.status === "paid" ? "Lunas" :
                       "Terlambat"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right font-medium">Deskripsi</div>
                  <div className="col-span-3">{showingDetailTagihan.description || "-"}</div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setEditingTagihan(showingDetailTagihan);
                setIsDialogOpen(true);
                setShowingDetailTagihan(null);
              }}>Edit</Button>
              <Button onClick={() => setShowingDetailTagihan(null)}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deletingTagihanId} onOpenChange={() => setDeletingTagihanId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingTagihanId(null)}>Batal</Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteTagihanMutation.isPending}
              >
                {deleteTagihanMutation.isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 