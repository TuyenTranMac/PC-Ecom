"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/app/(app)/trpcHelper/useTRPC";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  categories: Category[];
}

export const CategoryDialog = ({
  open,
  onClose,
  category,
  categories,
}: Props) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const { toast } = useToast();
  const trpc = useTRPC();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || "");
      setParentId(category.parentId || "");
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setParentId("");
    }
  }, [category]);

  const createMutation = useMutation(
    trpc.categories.create.mutationOptions({
      onSuccess: () => {
        toast({ title: "Đã tạo danh mục" });
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive",
        });
      },
    })
  );

  const updateMutation = useMutation(
    trpc.categories.update.mutationOptions({
      onSuccess: () => {
        toast({ title: "Đã cập nhật danh mục" });
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive",
        });
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      slug,
      description: description || undefined,
      parentId: parentId || undefined,
    };

    if (category) {
      updateMutation.mutate({
        id: category.id,
        ...data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug
    if (!category) {
      const autoSlug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  };

  const parentCategories = categories.filter(
    (c) => !c.parentId && c.id !== category?.id
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="VD: Laptop Gaming"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="laptop-gaming"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về danh mục..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Danh mục cha (tùy chọn)</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue placeholder="Không có (Root category)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Không có</SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {category ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
