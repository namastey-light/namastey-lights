import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Routes, Route } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { PurchaseDetails } from "@/components/admin/PurchaseDetails";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { CustomNeonPurchaseDetails } from "@/components/admin/CustomNeonPurchaseDetails";
import BestsellingManagement from "@/components/admin/BestsellingManagement";
import BannerManagement from "@/components/admin/BannerManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Admin = () => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      // Clear all auth data
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      await signOut();
      
      // Force redirect to login
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if signOut fails
      window.location.href = '/admin/login';
    }
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.email}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/categories" element={<CategoryManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/bestselling" element={<BestsellingManagement />} />
              <Route path="/banners" element={<BannerManagement />} />
              <Route path="/purchases" element={<PurchaseDetails />} />
              <Route path="/custom-neon" element={<CustomNeonPurchaseDetails />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Admin;