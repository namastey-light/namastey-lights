import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { state, updateQuantity, removeItem, closeCart } = useCart();

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg glass-panel border-l border-white/10 flex flex-col h-full p-0">
        <SheetHeader className="border-b border-white/10 p-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-orbitron">
              Shopping Cart
            </SheetTitle>
            <Badge variant="secondary" className="bg-neon-pink/20 text-neon-pink">
              {state.totalItems} items
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
            {state.items.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button asChild className="btn-neon" onClick={closeCart}>
                  <Link to="/products">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              state.items.map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-card/50 border border-white/10">
                  {/* Mobile and Desktop Layout */}
                  <div className="flex items-start space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-medium text-sm truncate">{item.name}</h3>
                          
                          {item.type === 'custom' && item.customConfig && (
                            <div className="text-xs text-muted-foreground mt-1">
                              <p className="truncate">Text: "{item.customConfig.text}"</p>
                              <p>Size: {item.customConfig.size} | Color: {item.customConfig.color}</p>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 text-destructive flex-shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Price and Quantity Controls Row */}
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-neon-blue font-semibold">
                          {formatPrice(item.price)}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-white/10 p-6 space-y-4 flex-shrink-0 bg-background/95 backdrop-blur-sm">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-neon-blue">{formatPrice(state.totalPrice)}</span>
              </div>

              <div className="space-y-3">
                <Button 
                  asChild 
                  className="btn-neon w-full h-12"
                  onClick={closeCart}
                >
                  <Link to="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="btn-outline-neon w-full h-12"
                  onClick={closeCart}
                >
                  <Link to="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;