"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/server/client";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/lib/schemas/product.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, X, Upload, ImageIcon } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

interface ProductFormProps {
  categories: Category[];
  maxImages: number;
  storeName: string;
}

export const ProductForm = ({
  categories,
  maxImages,
  storeName,
}: ProductFormProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      comparePrice: null,
      categoryId: "",
      images: [],
      stock: 0,
      isFeatured: false,
      isArchived: false,
    },
  });

  // Auto-generate slug từ name
  const watchName = form.watch("name");
  useEffect(() => {
    if (watchName && !form.formState.dirtyFields.slug) {
      const slug = watchName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug);
    }
  }, [watchName, form]);

  // Mutation tạo sản phẩm
  const createProductMutation = useMutation(
    trpc.product.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message || "Tạo sản phẩm thành công!");
        router.push("/dashboard");
        router.refresh();
      },
      onError: (error: any) => {
        toast.error(error.message || "Có lỗi xảy ra khi tạo sản phẩm");
      },
    })
  );

  // UploadThing hook
  const { startUpload, isUploading } = useUploadThing("productImage", {
    onClientUploadComplete: (res) => {
      const uploadedUrls = res.map((file) => file.url);
      const updatedUrls = [...imageUrls, ...uploadedUrls];
      setImageUrls(updatedUrls);
      form.setValue("images", updatedUrls);
      toast.success(`Đã upload ${res.length} ảnh thành công!`);
      setUploadingImages(false);
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploadingImages(false);
    },
  });

  // Xử lý upload ảnh với UploadThing
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentImages = imageUrls.length;
    const remainingSlots = maxImages - currentImages;

    if (files.length > remainingSlots) {
      toast.error(`Bạn chỉ có thể upload thêm ${remainingSlots} ảnh nữa`);
      return;
    }

    setUploadingImages(true);

    const fileArray = Array.from(files);
    await startUpload(fileArray);
  };

  // Xóa ảnh
  const handleRemoveImage = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    form.setValue("images", updatedUrls);
  };

  // Submit form
  const onSubmit = (data: CreateProductInput) => {
    createProductMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Tên sản phẩm */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Tên sản phẩm *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: iPhone 15 Pro Max 256GB"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Slug (URL) *</FormLabel>
                  <FormControl>
                    <Input placeholder="iphone-15-pro-max-256gb" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Tự động tạo từ tên sản phẩm. Có thể chỉnh sửa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mô tả */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      rows={4}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Danh mục *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Giá */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Giá bán</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá bán *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">VNĐ</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comparePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá gốc (so sánh)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Để hiển thị % giảm giá
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Kho */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Kho hàng</h2>

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="sm:w-1/2">
                <FormLabel>Số lượng tồn kho *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Upload ảnh */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Hình ảnh sản phẩm</h2>
            <span className="text-muted-foreground text-xs">
              {imageUrls.length}/{maxImages} ảnh
            </span>
          </div>

          {/* Tạm thời: Thêm URL trực tiếp */}
          {imageUrls.length < maxImages && (
            <div className="flex gap-2">
              <Input
                placeholder="Hoặc paste URL ảnh (Imgur, Cloudinary, etc.)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const url = e.currentTarget.value.trim();
                    if (url && imageUrls.length < maxImages) {
                      const updatedUrls = [...imageUrls, url];
                      setImageUrls(updatedUrls);
                      form.setValue("images", updatedUrls);
                      e.currentTarget.value = "";
                      toast.success("Đã thêm ảnh");
                    }
                  }
                }}
              />
            </div>
          )}

          <div className="grid gap-4">
            {/* Preview images */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="bg-muted group relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                        Ảnh đại diện
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {imageUrls.length < maxImages && (
              <div className="flex items-center justify-center">
                <label
                  htmlFor="image-upload"
                  className="border-primary/20 hover:bg-muted/50 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors sm:w-auto sm:px-12"
                >
                  {uploadingImages ? (
                    <Loader2 className="text-muted-foreground h-10 w-10 animate-spin" />
                  ) : (
                    <>
                      <Upload className="text-muted-foreground mb-2 h-10 w-10" />
                      <p className="text-muted-foreground text-sm font-medium">
                        Click để upload ảnh
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Còn {maxImages - imageUrls.length} ảnh
                      </p>
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImages || imageUrls.length >= maxImages}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={createProductMutation.isPending}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={createProductMutation.isPending}
            className="w-full sm:w-auto"
          >
            {createProductMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo sản phẩm"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

