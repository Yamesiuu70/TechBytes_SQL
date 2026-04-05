import { 
    addCartProduct, 
    getCartProductsByUserId, 
    updateCartProductQuantity, 
    deleteCartProductById,
    getCartWithProductDetails,
    getCartItemByUserAndProduct,
    getCartProductById
} from '../utils/cart.db.js';
import { getProductById } from '../utils/product.db.js';

// ============================================
// ADD PRODUCT TO CART (with availability check)
// ============================================
export async function addProductToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "productId and quantity required",
            });
        }

        const parsedProductId = parseInt(productId);
        if (isNaN(parsedProductId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        // Check if product exists and is available
        const product = await getProductById(parsedProductId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // ✅ Normalize availability to number and check
        const isAvailable = product.availability === true || product.availability === 1;
        
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Product is currently out of stock",
            });
        }

        // Check if product exists in cart
        const existingItem = await getCartItemByUserAndProduct(userId, parsedProductId);

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            await updateCartProductQuantity(existingItem.id, newQuantity);
            
            return res.json({ 
                success: true, 
                message: "Cart updated",
                cartItem: { id: existingItem.id, quantity: newQuantity }
            });
        }

        // Add new item
        const result = await addCartProduct({ 
            userId, 
            productId: parsedProductId, 
            quantity 
        });

        res.json({ 
            success: true, 
            message: "Product added to cart",
            cartItem: { id: result.id, quantity }
        });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}