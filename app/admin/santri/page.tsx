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
  BreadcrumbList, // Pastikan ini diimpor!
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
import { toast } from "sonner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface Santri {
  id: string;
  name: string;
  santriId: string;
  kelas: Kelas;
  phone?: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface Kelas {
  id: string;
  name: string;
  level?: string;
}

const santriFormSchema = z.object({
  name: z.string().min(1, "Nama santri tidak boleh kosong"),
  santriId: z.string().min(1, "ID Santri tidak boleh kosong"),
  kelasId: z.string().min(1, "Kelas harus dipilih"),
  phone: z.string().optional().transform(val => val === "" ? undefined : val),
});

const userCreateFormSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const userUpdateFormSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong").optional(),
  email: z.string().email("Email tidak valid").optional(),
});

export default function SantriPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSantri, setEditingSantri] = React.useState<Santri | null>(null);
  const [deletingSantriId, setDeletingSantriId] = React.useState<string | null>(null);
  const [showingDetailSantri, setShowingDetailSantri] = React.useState<Santri | null>(null);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const queryClient = useQueryClient();

  const {
    data: santriData,
    isLoading: isLoadingSantri,
    error: errorSantri,
  } = useQuery<Santri[]>({ queryKey: ["santri"], queryFn: () => fetch("/api/santri").then((res) => res.json()) });

  const {
    data: kelasData,
    isLoading: isLoadingKelas,
    error: errorKelas,
  } = useQuery<Kelas[]>({ queryKey: ["kelas"], queryFn: () => fetch("/api/kelas").then((res) => res.json()) });

  const addSantriMutation = useMutation({
    mutationFn: async (data: { userData: z.infer<typeof userCreateFormSchema>, santriData: z.infer<typeof santriFormSchema> }) => {
      // 1. Register user baru
      const userRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data.userData, role: "santri" }),
      });
      const userResult = await userRes.json();
      if (!userResult.success) {
        throw new Error(userResult.message || "Gagal mendaftarkan user");
      }
      // 2. Tambah data santri dengan userId hasil register
      const santriRes = await fetch("/api/santri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data.santriData, userId: userResult.user.id }),
      });
      return santriRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      setIsDialogOpen(false);
      setEditingSantri(null);
    },
  });

  const updateSantriMutation = useMutation({
    mutationFn: (updatedSantri: Santri) =>
      fetch(`/api/santri/${updatedSantri.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSantri),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      setIsDialogOpen(false);
      setEditingSantri(null);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: { userId: string, userData: z.infer<typeof userUpdateFormSchema> }) => {
      const res = await fetch(`/api/auth/users/${data.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.userData),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["santri"] }); // Invalidate santri to refetch user data
    },
  });

  const deleteSantriMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/santri/${id}`, {
        method: "DELETE",
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      setDeletingSantriId(null);
    },
  });

  if (errorSantri) return <div>Terjadi kesalahan: {errorSantri.message}</div>;
  if (errorKelas) return <div>Terjadi kesalahan saat memuat kelas: {errorKelas.message}</div>;

  const columns: ColumnDef<Santri>[] = [
    {
      id: "select",
      header: ({ table }: { table: TanstackTable<Santri> }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: Row<Santri> }) => (
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
      cell: ({ row }: { row: Row<Santri> }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }: { row: Row<Santri> }) => <div className="capitalize">{row.getValue<string>("name")}</div>,
    },
    {
      accessorKey: "kelas",
      header: "Kelas",
      cell: ({ row }: { row: Row<Santri> }) => <div className="lowercase">{row.original.kelas.name}</div>,
    },
    {
      accessorKey: "phone",
      header: "Telepon",
      cell: ({ row }: { row: Row<Santri> }) => <div className="lowercase">{row.getValue<string | undefined>("phone")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Santri> }) => {
        const santri = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditSantri(santri)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => confirmDeleteSantri(santri.id)}>Hapus</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDetailSantri(santri)}>Detail</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable<Santri>({
    data: santriData || [],
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

  const form = useForm<z.infer<typeof santriFormSchema>>({
    resolver: zodResolver(santriFormSchema),
    defaultValues: {
      name: "",
      santriId: "",
      kelasId: "",
      phone: "",
    },
  });

  const userForm = useForm<z.infer<typeof userCreateFormSchema>>({
    resolver: zodResolver(userCreateFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (editingSantri) {
      form.reset({
        name: editingSantri.name,
        santriId: editingSantri.santriId,
        kelasId: editingSantri.kelas.id,
        phone: editingSantri.phone || "",
      });
      userForm.reset({
        username: editingSantri.user.username,
        email: editingSantri.user.email,
        password: "", // Password not displayed/edited
      });
    } else {
      form.reset();
      userForm.reset();
    }
  }, [editingSantri, form, userForm]);

  async function onSubmit(values: z.infer<typeof santriFormSchema>) {
    try {
      if (editingSantri) {
        const santriUpdateData = { ...editingSantri, ...values };
        const userUpdateData = userForm.getValues();

        await updateSantriMutation.mutateAsync(santriUpdateData);
        await updateUserMutation.mutateAsync({ 
          userId: editingSantri.user.id, 
          userData: { 
            username: userUpdateData.username, 
            email: userUpdateData.email 
          } 
        });

        setIsDialogOpen(false);
        setEditingSantri(null);
        toast.success("Data santri berhasil diperbarui");
      } else {
        const userValues = userForm.getValues();
        console.log("Data yang akan dikirim:", {
          userData: userValues,
          santriData: values
        });

        // Register user baru
        const userRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userValues.username,
            email: userValues.email,
            password: userValues.password,
            name: values.name,
            kelasId: values.kelasId,
            phone: values.phone
          }),
        });

        const response = await userRes.json();

        if (!userRes.ok) {
          throw new Error(response.message || "Gagal mendaftarkan user");
        }

        console.log("Hasil registrasi:", response);
        queryClient.invalidateQueries({ queryKey: ["santri"] });
        setIsDialogOpen(false);
        form.reset();
        userForm.reset();
        toast.success("Santri berhasil ditambahkan");
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data");
    }
  }

  const handleAddSantri = () => {
    setEditingSantri(null);
    form.reset({
      name: "",
      santriId: "",
      kelasId: "",
      phone: "",
    });
    userForm.reset({
      username: "",
      email: "",
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditSantri = (santri: Santri) => {
    setEditingSantri(santri);
    form.reset({
      name: santri.name,
      santriId: santri.santriId,
      kelasId: santri.kelas.id,
      phone: santri.phone || "",
    });
    userForm.reset({
      username: santri.user.username,
      email: santri.user.email,
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSantri(null);
    form.reset({
      name: "",
      santriId: "",
      kelasId: "",
      phone: "",
    });
    userForm.reset({
      username: "",
      email: "",
      password: "",
    });
  };

  const confirmDeleteSantri = (id: string) => {
    setDeletingSantriId(id);
  };

  const handleDeleteConfirm = () => {
    if (deletingSantriId) {
      deleteSantriMutation.mutate(deletingSantriId);
    }
  };

  const handleDetailSantri = (santri: Santri) => {
    setShowingDetailSantri(santri);
  };

  return (
    <div className="flex flex-col flex-1 gap-4 p-4 pt-0 mt-6 max-w-[1400px] mx-auto w-full pb-8">
      <header className="flex h-14 shrink-0 items-center justify-between w-full">
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
                  <BreadcrumbPage>Santri</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight">Santri</h2>
          </div>
        </div>
        <Button onClick={handleAddSantri}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Santri
        </Button>
      </header>
      <div className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center py-4">
                <Input
                  placeholder="Filter santri..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSantri ? "Edit Santri" : "Tambah Santri"}</DialogTitle>
            <DialogDescription>
              {editingSantri
                ? "Edit informasi santri."
                : "Tambahkan santri baru ke sistem."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!editingSantri && (
                <FormField
                  control={userForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Santri" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="santriId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Santri</FormLabel>
                    <FormControl>
                      <Input placeholder="S001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kelasId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {kelasData?.map((kelas) => (
                          <SelectItem key={kelas.id} value={kelas.id}>
                            {kelas.name} {kelas.level ? `(${kelas.level})` : ""}
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="08123456789" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={addSantriMutation.isPending || updateSantriMutation.isPending || updateUserMutation.isPending}>
                  {addSantriMutation.isPending || updateSantriMutation.isPending || updateUserMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showingDetailSantri} onOpenChange={() => setShowingDetailSantri(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Santri</DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai santri.
            </DialogDescription>
          </DialogHeader>
          {showingDetailSantri && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <div className="text-right font-medium">Username</div>
                <div className="col-span-3">{showingDetailSantri.user.username}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <div className="text-right font-medium">Email</div>
                <div className="col-span-3">{showingDetailSantri.user.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <div className="text-right font-medium">Nama</div>
                <div className="col-span-3">{showingDetailSantri.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <div className="text-right font-medium">ID Santri</div>
                <div className="col-span-3">{showingDetailSantri.santriId}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <div className="text-right font-medium">Kelas</div>
                <div className="col-span-3">{showingDetailSantri.kelas.name} {showingDetailSantri.kelas.level ? `(${showingDetailSantri.kelas.level})` : ""}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right font-medium">Nomor Telepon</div>
                <div className="col-span-3">{showingDetailSantri.phone || "-"}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingSantri(showingDetailSantri);
              setIsDialogOpen(true);
              setShowingDetailSantri(null);
            }}>Edit</Button>
            <Button onClick={() => setShowingDetailSantri(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingSantriId} onOpenChange={() => setDeletingSantriId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus santri ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSantriId(null)}>Batal</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteSantriMutation.isPending}
            >
              {deleteSantriMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}