import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Eye, EyeOff, Link as LinkIcon, Plus, Move } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Banner {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBanners();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('banner-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'banners'
        },
        () => {
          fetchBanners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async () => {
    // Validate required fields
    if (!newBanner.title.trim()) {
      toast({
        title: "Error",
        description: "Banner title is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    await handleFileUpload();
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Add banner to database
      const { error: insertError } = await supabase
        .from('banners')
        .insert({
          title: newBanner.title.trim(),
          image_url: publicUrl,
          link_url: null,
          is_active: newBanner.is_active,
          display_order: banners.length
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Banner uploaded successfully!",
      });

      // Reset form
      setNewBanner({
        title: '',
        is_active: true
      });
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById('banner-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Error",
        description: "Failed to upload banner",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Banner ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  const deleteBanner = async (id: string, imageUrl: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Delete from storage
      const imagePath = imageUrl.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from('product-images')
          .remove([`banners/${imagePath}`]);
      }

      toast({
        title: "Success",
        description: "Banner deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const updateDisplayOrder = async (bannerId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ display_order: newOrder })
        .eq('id', bannerId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating display order:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading banners...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <Badge variant="secondary">{banners.length} Total Banners</Badge>
      </div>

      {/* Add New Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Banner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="banner-title">Banner Title *</Label>
            <Input
              id="banner-title"
              placeholder="Enter banner title... (Required)"
              value={newBanner.title}
              onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
              className={!newBanner.title.trim() ? 'border-red-500' : ''}
              required
            />
            {!newBanner.title.trim() && (
              <p className="text-sm text-red-500 mt-1">Banner title is required</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="banner-active"
              checked={newBanner.is_active}
              onCheckedChange={(checked) => setNewBanner({ ...newBanner, is_active: checked })}
            />
            <Label htmlFor="banner-active">Active on upload</Label>
          </div>

          <div>
            <Label htmlFor="banner-upload">Upload Banner Image *</Label>
            <div className="mt-2">
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                disabled={uploading}
                required
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-green-600 mt-2">
                ✓ File selected: {selectedFile.name}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Recommended: 1200x300px or similar landscape ratio. Max size: 5MB
            </p>
          </div>

          <Button 
            onClick={handleAddBanner}
            disabled={uploading || !newBanner.title.trim() || !selectedFile}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading Banner...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Banners List */}
      <div className="grid gap-4">
        {banners.map((banner, index) => (
          <Card key={banner.id} className={!banner.is_active ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateDisplayOrder(banner.id, Math.max(0, banner.display_order - 1))}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <span className="text-xs font-mono">{banner.display_order}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateDisplayOrder(banner.id, banner.display_order + 1)}
                    disabled={index === banners.length - 1}
                  >
                    ↓
                  </Button>
                </div>

                <img
                  src={banner.image_url}
                  alt={banner.title || 'Banner'}
                  className="w-32 h-20 object-cover rounded-lg"
                />

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold">{banner.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={banner.is_active ? "default" : "secondary"}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Created: {new Date(banner.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                  >
                    {banner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBanner(banner.id, banner.image_url)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {banners.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No banners yet</h3>
              <p className="text-muted-foreground">Upload your first banner to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;