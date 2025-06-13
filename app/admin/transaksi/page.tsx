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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Transaksi {
  id: string;
  tagihanId: string;
  amount: number;
  paymentDate: string;
  status: string;
  note?: string;
  santri?: {
    id: string;
    name: string;
    kelas?: {
      id: string;
      name: string;
      level?: string;
    };
  };
  tagihan?: {
    id: string;
    amount: number;
    status: "pending" | "paid" | "overdue";
    santri?: {
      id: string;
      name: string;
      kelas?: {
        id: string;
        name: string;
        level?: string;
      };
    };
    jenisTagihan: {
      id: string;
      name: string;
    };
  };
}

interface Tagihan {
  id: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
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

const formSchema = z.object({
  id: z.string().optional(),
  tagihanId: z.string().uuid("Pilih tagihan yang valid"),
  amount: z.coerce.number().min(0, "Jumlah harus lebih dari atau sama dengan 0"),
  paymentDate: z.string().min(1, "Tanggal pembayaran harus diisi"),
  status: z.enum(["pending", "approved", "rejected"]),
  note: z.string().optional(),
});

export default function TransaksiPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // State hooks
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTransaksi, setEditingTransaksi] = React.useState<Transaksi | null>(null);
  const [deletingTransaksiId, setDeletingTransaksiId] = React.useState<string | null>(null);
  const [showingDetailTransaksi, setShowingDetailTransaksi] = React.useState<Transaksi | null>(null);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      tagihanId: "",
      amount: 0,
      paymentDate: "",
      status: "pending",
      note: "",
    },
  });

  // Query hooks
  const {
    data: transaksiData,
    isLoading: isLoadingTransaksi,
    error: errorTransaksi,
  } = useQuery<Transaksi[]>({ 
    queryKey: ["transaksi"], 
    queryFn: () => fetch("/api/transaksi").then((res) => res.json()) 
  });

  const {
    data: tagihanData,
    isLoading: isLoadingTagihan,
    error: errorTagihan,
  } = useQuery<Tagihan[]>({ 
    queryKey: ["tagihan"], 
    queryFn: () => fetch("/api/tagihan").then((res) => res.json()) 
  });

  // Mutation hooks
  const addTransaksiMutation = useMutation({
    mutationFn: async (newTransaksi: z.infer<typeof formSchema>) => {
      console.log('Sending data to API:', newTransaksi);
      const response = await fetch("/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaksi),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || "Gagal menambahkan transaksi");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaksi", "tagihan"] });
      setIsDialogOpen(false);
      setEditingTransaksi(null);
      form.reset();
      toast.success("Transaksi berhasil ditambahkan");
    },
    onError: (error: Error) => {
      console.error('Mutation Error:', error);
      toast.error(error.message);
    },
  });

  const updateTransaksiMutation = useMutation({
    mutationFn: async (updatedTransaksi: Partial<Transaksi> & { id: string }) => {
      console.log('Sending update data to API:', updatedTransaksi);
      const response = await fetch(`/api/transaksi/${updatedTransaksi.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagihanId: updatedTransaksi.tagihanId,
          amount: updatedTransaksi.amount,
          paymentDate: updatedTransaksi.paymentDate,
          status: updatedTransaksi.status,
          description: updatedTransaksi.note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || "Gagal memperbarui transaksi");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaksi", "tagihan"] });
      setIsDialogOpen(false);
      setEditingTransaksi(null);
      form.reset();
      toast.success("Transaksi berhasil diperbarui");
    },
    onError: (error: Error) => {
      console.error('Mutation Error:', error);
      toast.error(error.message);
    },
  });

  const deleteTransaksiMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/transaksi/${id}`, {
        method: "DELETE",
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaksi", "tagihan"] });
      setDeletingTransaksiId(null);
      toast.success("Transaksi berhasil dihapus");
    },
  });

  // Effect hooks
  React.useEffect(() => {
    if (editingTransaksi) {
      try {
        // Pastikan paymentDate ada dan valid
        if (!editingTransaksi.paymentDate || 
            (typeof editingTransaksi.paymentDate === 'object' && 
             Object.keys(editingTransaksi.paymentDate).length === 0)) {
          throw new Error('Payment date is required');
        }

        // Log untuk debugging
        console.log('Raw paymentDate:', editingTransaksi.paymentDate);
        console.log('Type of paymentDate:', typeof editingTransaksi.paymentDate);

        // Coba parse tanggal dengan berbagai format
        let paymentDate: Date;
        const rawDate = editingTransaksi.paymentDate;
        
        if (typeof rawDate === 'string') {
          // Jika string, coba parse sebagai ISO string
          paymentDate = new Date(rawDate);
        } else if (rawDate && typeof rawDate === 'object' && 'getTime' in rawDate) {
          // Jika sudah Date object, gunakan langsung
          paymentDate = rawDate as Date;
        } else {
          // Jika format lain, coba parse sebagai timestamp
          paymentDate = new Date(Number(rawDate));
        }

        // Validasi hasil parsing
        if (isNaN(paymentDate.getTime())) {
          console.error('Failed to parse date:', rawDate);
          throw new Error('Invalid date format');
        }

        // Format tanggal ke YYYY-MM-DD
        const formattedDate = paymentDate.toISOString().split('T')[0];
        console.log('Formatted date in useEffect:', formattedDate);

        form.reset({
          id: editingTransaksi.id,
          tagihanId: editingTransaksi.tagihanId,
          amount: editingTransaksi.amount,
          paymentDate: formattedDate,
          status: editingTransaksi.status as "pending" | "approved" | "rejected",
          note: editingTransaksi.note || "",
        });
      } catch (error) {
        console.error('Error in useEffect:', error);
        // Gunakan tanggal hari ini sebagai fallback
        const today = new Date().toISOString().split('T')[0];
        form.reset({
          id: editingTransaksi.id,
          tagihanId: editingTransaksi.tagihanId,
          amount: editingTransaksi.amount,
          paymentDate: today,
          status: editingTransaksi.status as "pending" | "approved" | "rejected",
          note: editingTransaksi.note || "",
        });
      }
    } else {
      form.reset({
        id: "",
        tagihanId: "",
        amount: 0,
        paymentDate: "",
        status: "pending",
        note: "",
      });
    }
  }, [editingTransaksi, form]);

  // Table configuration
  const columns: ColumnDef<Transaksi>[] = [
    {
      id: "select",
      header: ({ table }: { table: TanstackTable<Transaksi> }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: Row<Transaksi> }) => (
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
      cell: ({ row }: { row: Row<Transaksi> }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "santri",
      header: "Santri",
      accessorFn: (row) => row.santri?.name || row.tagihan?.santri?.name || "-",
      cell: ({ row }: { row: Row<Transaksi> }) => {
        const santri = row.original.santri || row.original.tagihan?.santri;
        return (
          <div className="flex flex-col">
            <div className="font-medium">{santri?.name || "-"}</div>
            <div className="text-sm text-muted-foreground">
              {santri?.kelas?.name || "-"} {santri?.kelas?.level ? `(${santri.kelas.level})` : ""}
            </div>
          </div>
        );
      },
    },
    {
      id: "jenisTagihan",
      header: "Jenis Tagihan",
      accessorFn: (row) => row.tagihan?.jenisTagihan?.name || "-",
      cell: ({ row }: { row: Row<Transaksi> }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.original.tagihan?.jenisTagihan?.name || "-"}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.tagihan?.status === "overdue" ? "Terlambat" : 
             row.original.tagihan?.status === "paid" ? "Lunas" : "Menunggu"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Jumlah",
      cell: ({ row }: { row: Row<Transaksi> }) => {
        const amount = row.getValue<number>("amount");
        const tagihanAmount = row.original.tagihan?.amount || 0;
        const isFullPayment = amount >= tagihanAmount;
        
        return (
          <div className="flex flex-col">
            <div className="font-medium">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(amount)}
            </div>
            {!isFullPayment && (
              <div className="text-sm text-yellow-600">
                Pembayaran Sebagian
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: Row<Transaksi> }) => {
        const status = row.getValue<string>("status");
        const statusColors = {
          pending: "bg-yellow-100 text-yellow-800",
          approved: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
        };
        const statusLabels = {
          pending: "Menunggu",
          approved: "Disetujui",
          rejected: "Ditolak",
        };
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
            {statusLabels[status as keyof typeof statusLabels]}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentDate",
      header: "Tanggal Pembayaran",
      cell: ({ row }: { row: Row<Transaksi> }) => {
        try {
          const paymentDateStr = row.getValue<string>("paymentDate");
          
          // Cek jika paymentDate kosong atau tidak valid
          if (!paymentDateStr || 
              typeof paymentDateStr !== 'string' || 
              paymentDateStr === "{}" || 
              paymentDateStr === "null" ||
              paymentDateStr === "undefined") {
            return <div className="text-muted-foreground">-</div>;
          }

          // Pastikan format tanggal valid
          const paymentDate = new Date(paymentDateStr);
          if (isNaN(paymentDate.getTime())) {
            console.error('Invalid payment date:', paymentDateStr);
            return <div className="text-red-500">Format tanggal tidak valid</div>;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset waktu ke awal hari
          paymentDate.setHours(0, 0, 0, 0); // Reset waktu ke awal hari
          
          const isLate = paymentDate > today;
          
          return (
            <div className="flex flex-col">
              <div className="font-medium">
                {paymentDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              {isLate && (
                <div className="text-sm text-red-600">
                  Pembayaran Terlambat
                </div>
              )}
            </div>
          );
        } catch (error) {
          console.error('Error formatting payment date:', error);
          return <div className="text-red-500">Error format tanggal</div>;
        }
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Transaksi> }) => {
        const transaksi = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditTransaksi(transaksi)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => confirmDeleteTransaksi(transaksi.id)}>Hapus</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDetailTransaksi(transaksi)}>Detail</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable<Transaksi>({
    data: transaksiData || [],
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
  const handleEditTransaksi = async (transaksi: Transaksi) => {
    try {
      // Ambil data transaksi terbaru dari API
      const response = await fetch(`/api/transaksi/${transaksi.id}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data transaksi');
      }
      const updatedTransaksi = await response.json();
      
      // Format tanggal ke YYYY-MM-DD
      let paymentDate = new Date().toISOString().split('T')[0];

      // Coba dapatkan tanggal dari transaksi jika ada
      if (updatedTransaksi.paymentDate && 
          typeof updatedTransaksi.paymentDate === 'string' &&
          updatedTransaksi.paymentDate !== "{}" && 
          updatedTransaksi.paymentDate !== "null" &&
          updatedTransaksi.paymentDate !== "undefined") {
        try {
          // Pastikan format tanggal valid
          const date = new Date(updatedTransaksi.paymentDate);
          if (!isNaN(date.getTime())) {
            paymentDate = date.toISOString().split('T')[0];
          } else {
            console.error('Invalid payment date:', updatedTransaksi.paymentDate);
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }

      setEditingTransaksi({
        ...updatedTransaksi,
        paymentDate
      });

      form.reset({
        id: updatedTransaksi.id,
        tagihanId: updatedTransaksi.tagihanId,
        amount: updatedTransaksi.amount,
        paymentDate,
        status: updatedTransaksi.status as "pending" | "approved" | "rejected",
        note: updatedTransaksi.note || "",
      });
      
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error in handleEditTransaksi:', error);
      toast.error('Gagal mengambil data transaksi');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaksi(null);
    form.reset({
      id: "",
      tagihanId: "",
      amount: 0,
      paymentDate: "",
      status: "pending",
      note: "",
    });
  };

  const confirmDeleteTransaksi = (id: string) => {
    setDeletingTransaksiId(id);
  };

  const handleDeleteConfirm = () => {
    if (deletingTransaksiId) {
      deleteTransaksiMutation.mutate(deletingTransaksiId);
    }
  };

  const handleDetailTransaksi = (transaksi: Transaksi) => {
    setShowingDetailTransaksi(transaksi);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log('Form data:', data);

      // Format tanggal ke YYYY-MM-DD
      let paymentDate = new Date().toISOString().split('T')[0];
      
      if (data.paymentDate && 
          typeof data.paymentDate === 'string' &&
          data.paymentDate !== "{}" && 
          data.paymentDate !== "null" &&
          data.paymentDate !== "undefined") {
        try {
          const date = new Date(data.paymentDate);
          if (!isNaN(date.getTime())) {
            paymentDate = date.toISOString().split('T')[0];
          } else {
            toast.error("Format tanggal pembayaran tidak valid");
            return;
          }
        } catch (e) {
          console.error('Error parsing date:', e);
          toast.error("Format tanggal pembayaran tidak valid");
          return;
        }
      }

      // Validasi tagihan sebelum mengirim data
      const selectedTagihan = tagihanData?.find(t => t.id === data.tagihanId);
      if (!selectedTagihan) {
        toast.error("Tagihan tidak ditemukan");
        return;
      }

      // Validasi status tagihan
      if (selectedTagihan.status === "paid") {
        toast.error("Tagihan ini sudah dibayar");
        return;
      }

      if (selectedTagihan.status === "overdue") {
        toast.error("Tagihan ini sudah terlambat");
        return;
      }

      // Validasi jumlah pembayaran
      if (Number(data.amount) < selectedTagihan.amount) {
        toast.error("Jumlah pembayaran tidak boleh kurang dari jumlah tagihan");
        return;
      }

      const payload = {
        tagihanId: data.tagihanId,
        amount: Number(data.amount),
        paymentDate,
        status: data.status,
        description: data.note || "",
      };

      console.log('Payload:', payload);

      if (editingTransaksi) {
        await updateTransaksiMutation.mutateAsync({
          id: editingTransaksi.id,
          ...payload,
        });
      } else {
        await addTransaksiMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan saat menyimpan data");
      }
    }
  };

  if (isLoadingTransaksi || isLoadingTagihan) return <div>Memuat data...</div>;
  if (errorTransaksi || errorTagihan) return <div>Terjadi kesalahan saat memuat data</div>;

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
                      <BreadcrumbPage>Transaksi</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <h2 className="text-3xl font-bold tracking-tight">Transaksi</h2>
              </div>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Transaksi
            </Button>
          </header>
          <div className="flex-1 space-y-6">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter transaksi..."
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
                {editingTransaksi ? "Edit Transaksi" : "Tambah Transaksi"}
              </DialogTitle>
              <DialogDescription>
                {editingTransaksi
                  ? "Ubah informasi transaksi yang ada"
                  : "Tambahkan transaksi baru ke sistem"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="tagihanId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagihan</FormLabel>
                      {editingTransaksi ? (
                        <FormControl>
                          <Input
                            value={tagihanData?.find(t => t.id === field.value)?.jenisTagihan.name || '-'}
                            disabled
                          />
                        </FormControl>
                      ) : (
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedTagihan = tagihanData?.find(t => t.id === value);
                            if (selectedTagihan) {
                              form.setValue("amount", selectedTagihan.amount);
                              // Set status default berdasarkan status tagihan
                              if (selectedTagihan.status === "overdue") {
                                form.setValue("status", "rejected");
                              } else {
                                form.setValue("status", "pending");
                              }
                            }
                          }}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tagihan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tagihanData?.filter(t => t.status === "pending" || t.status === "overdue").map((tagihan) => (
                              <SelectItem key={tagihan.id} value={tagihan.id}>
                                {tagihan.santri.name} - {tagihan.jenisTagihan.name} ({new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                }).format(tagihan.amount)}) - {tagihan.status === "overdue" ? "Terlambat" : "Menunggu"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Pembayaran</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP", { locale: id })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const formattedDate = date.toISOString().split('T')[0];
                                field.onChange(formattedDate);
                              }
                            }}
                            disabled={(date) =>
                              date < new Date("1900-01-01") || date > new Date("2100-12-31")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Menunggu</SelectItem>
                          <SelectItem value="approved">Disetujui</SelectItem>
                          <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
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
                    disabled={addTransaksiMutation.isPending || updateTransaksiMutation.isPending}
                  >
                    {editingTransaksi ? "Simpan Perubahan" : "Tambah"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!showingDetailTransaksi} onOpenChange={() => setShowingDetailTransaksi(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detail Transaksi</DialogTitle>
              <DialogDescription>
                Informasi lengkap mengenai transaksi.
              </DialogDescription>
            </DialogHeader>
            {showingDetailTransaksi && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Santri</div>
                  <div className="col-span-3">
                    <div className="font-medium">
                      {showingDetailTransaksi.santri?.name || 
                       showingDetailTransaksi.tagihan?.santri?.name || "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {showingDetailTransaksi.santri?.kelas?.name || 
                       showingDetailTransaksi.tagihan?.santri?.kelas?.name || "-"} 
                      {showingDetailTransaksi.santri?.kelas?.level || 
                       showingDetailTransaksi.tagihan?.santri?.kelas?.level ? 
                       ` (${showingDetailTransaksi.santri?.kelas?.level || 
                          showingDetailTransaksi.tagihan?.santri?.kelas?.level})` : ""}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Jenis Tagihan</div>
                  <div className="col-span-3">
                    {showingDetailTransaksi.tagihan?.jenisTagihan?.name || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Jumlah</div>
                  <div className="col-span-3">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(showingDetailTransaksi.amount)}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Status</div>
                  <div className="col-span-3">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      showingDetailTransaksi.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      showingDetailTransaksi.status === "approved" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {showingDetailTransaksi.status === "pending" ? "Menunggu" :
                       showingDetailTransaksi.status === "approved" ? "Disetujui" :
                       "Ditolak"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <div className="text-right font-medium">Tanggal Pembayaran</div>
                  <div className="col-span-3">
                    {new Date(showingDetailTransaksi.paymentDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right font-medium">Deskripsi</div>
                  <div className="col-span-3">{showingDetailTransaksi.note || "-"}</div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setEditingTransaksi(showingDetailTransaksi);
                setIsDialogOpen(true);
                setShowingDetailTransaksi(null);
              }}>Edit</Button>
              <Button onClick={() => setShowingDetailTransaksi(null)}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deletingTransaksiId} onOpenChange={() => setDeletingTransaksiId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingTransaksiId(null)}>Batal</Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteTransaksiMutation.isPending}
              >
                {deleteTransaksiMutation.isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}