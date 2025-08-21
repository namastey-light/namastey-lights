import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Product, ProductImage, Category } from "@/types/product";

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    small_mrp: "",
    small_price: "",
    medium_mrp: "",
    medium_price: "",
    large_mrp: "",
    large_price: "",
    category_id: "",
    stock_quantity: "",
    rating: "",
    review_count: "",
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();

    // Set up real-time listeners for admin panel
    const productChannel = supabase
      .channel('admin-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchData(); // Refetch when products change
        }
      )
      .subscribe();

    const categoryChannel = supabase
      .channel('admin-categories-changes-products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          fetchData(); // Refetch when categories change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(categoryChannel);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            categories(name)
          `)
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("id, name").order("name"),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (productId: string) => {
    const uploadedImages = [];
    
    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      uploadedImages.push({
        product_id: productId,
        image_url: publicUrl,
        display_order: i + 1
      });
    }
    
    if (uploadedImages.length > 0) {
      const { error } = await supabase
        .from('product_images')
        .insert(uploadedImages);
        
      if (error) throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.category_id) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    if (!editingProduct && selectedImages.length < 1) {
      toast({
        title: "Error",
        description: "Please upload at least 1 image",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedImages.length > 5) {
      toast({
        title: "Error",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        small_mrp: formData.small_mrp ? parseFloat(formData.small_mrp) : null,
        small_price: formData.small_price ? parseFloat(formData.small_price) : null,
        medium_mrp: formData.medium_mrp ? parseFloat(formData.medium_mrp) : null,
        medium_price: formData.medium_price ? parseFloat(formData.medium_price) : null,
        large_mrp: formData.large_mrp ? parseFloat(formData.large_mrp) : null,
        large_price: formData.large_price ? parseFloat(formData.large_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        rating: formData.rating ? parseFloat(formData.rating) : 4.0,
        review_count: formData.review_count ? parseInt(formData.review_count) : 0,
        category_id: formData.category_id,
        is_active: formData.is_active,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        
        // Upload new images if any
        if (selectedImages.length > 0) {
          await uploadImages(editingProduct.id);
        }
        
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([productData])
          .select()
          .single();

        if (error) throw error;
        
        // Upload images for new product
        await uploadImages(data.id);
        
        toast({ title: "Success", description: "Product created successfully" });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      small_mrp: "",
      small_price: "",
      medium_mrp: "",
      medium_price: "",
      large_mrp: "",
      large_price: "",
      category_id: "",
      stock_quantity: "",
      rating: "",
      review_count: "",
      is_active: true,
    });
    setSelectedImages([]);
    setExistingImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      toast({
        title: "Error",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const fetchProductImages = async (productId: string) => {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('display_order');
      
    if (error) {
      console.error('Error fetching product images:', error);
      return [];
    }
    
    return data || [];
  };

  const handleEdit = async (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      small_mrp: product.small_mrp?.toString() || "",
      small_price: product.small_price?.toString() || "",
      medium_mrp: product.medium_mrp?.toString() || "",
      medium_price: product.medium_price?.toString() || "",
      large_mrp: product.large_mrp?.toString() || "",
      large_price: product.large_price?.toString() || "",
      category_id: product.category_id || "",
      stock_quantity: product.stock_quantity.toString(),
      rating: product.rating?.toString() || "",
      review_count: product.review_count?.toString() || "",
      is_active: product.is_active,
    });
    
    // Fetch existing images
    const images = await fetchProductImages(product.id);
    setExistingImages(images);
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selection - First Priority */}
              <div>
                <Label htmlFor="category" className="text-base font-semibold">
                  Category *
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  required
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a category first" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Size-specific pricing */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Size-wise Pricing *</Label>
                
                {/* Small Size */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-sm font-medium text-neon-white">Small Size (0.5ft x 0.5ft)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="small_mrp">MRP ₹</Label>
                      <Input
                        id="small_mrp"
                        type="number"
                        step="0.01"
                        value={formData.small_mrp}
                        onChange={(e) => setFormData({ ...formData, small_mrp: e.target.value })}
                        placeholder="320"
                      />
                    </div>
                    <div>
                      <Label htmlFor="small_price">Selling Price ₹</Label>
                      <Input
                        id="small_price"
                        type="number"
                        step="0.01"
                        value={formData.small_price}
                        onChange={(e) => setFormData({ ...formData, small_price: e.target.value })}
                        placeholder="320"
                      />
                    </div>
                  </div>
                </div>

                {/* Medium Size */}
                <div className="border rounded-lg p-4 space-y-3 border-primary">
                  <Label className="text-sm font-medium text-primary">Medium Size (1ft x 1ft) - Default Display</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medium_mrp">MRP ₹ *</Label>
                      <Input
                        id="medium_mrp"
                        type="number"
                        step="0.01"
                        value={formData.medium_mrp}
                        onChange={(e) => setFormData({ ...formData, medium_mrp: e.target.value })}
                        placeholder="500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="medium_price">Selling Price ₹ *</Label>
                      <Input
                        id="medium_price"
                        type="number"
                        step="0.01"
                        value={formData.medium_price}
                        onChange={(e) => setFormData({ ...formData, medium_price: e.target.value })}
                        placeholder="400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Large Size */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-sm font-medium text-neon-white">Large Size (1.5ft x 1.5ft)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="large_mrp">MRP ₹</Label>
                      <Input
                        id="large_mrp"
                        type="number"
                        step="0.01"
                        value={formData.large_mrp}
                        onChange={(e) => setFormData({ ...formData, large_mrp: e.target.value })}
                        placeholder="700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="large_price">Selling Price ₹</Label>
                      <Input
                        id="large_price"
                        type="number"
                        step="0.01"
                        value={formData.large_price}
                        onChange={(e) => setFormData({ ...formData, large_price: e.target.value })}
                        placeholder="560"
                      />
                    </div>
                  </div>
                </div>

                
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  required
                />
              </div>

              {/* Rating and Review Count Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Rating & Reviews</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating (0-5) *</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      placeholder="4.0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="review_count">Review Count *</Label>
                    <Input
                      id="review_count"
                      type="number"
                      min="0"
                      value={formData.review_count}
                      onChange={(e) => setFormData({ ...formData, review_count: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <Label className="text-base font-semibold">
                  Product Images * (1-5 images required)
                </Label>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm text-muted-foreground">Existing Images:</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {existingImages.map((image, index) => (
                        <div key={image.id} className="relative">
                          <img 
                            src={image.image_url} 
                            alt={`Product image ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          {index === 0 && (
                            <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Image Upload */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-2">
                      <Label htmlFor="images" className="cursor-pointer">
                        <span className="text-primary font-medium">Click to upload</span>
                        <span className="text-muted-foreground"> or drag and drop</span>
                      </Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, JPEG up to 10MB each
                    </p>
                  </div>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground">
                      Selected Images ({selectedImages.length}/5):
                    </Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  editingProduct ? "Update Product" : "Create Product"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categories?.name || "No category"}</TableCell>
                  <TableCell>₹{product.medium_price || 'N/A'}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found. Create your first product!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}