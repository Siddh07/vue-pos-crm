import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
    id: number
    name: string
    price: number
}

export interface CartItem extends Product {
    quantity: number
}

export const usePosStore = defineStore('pos', () => {
    const cart = ref<CartItem[]>([])
    const products = ref<Product[]>([
        { id: 1, name: 'Espresso', price: 3.50 },
        { id: 2, name: 'Croissant', price: 2.75 },
        { id: 3, name: 'Cold Brew', price: 4.25 },
    ])

    const cartTotal = computed(() => {
        return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })

    function addToCart(product: Product) {
        const existing = cart.value.find((item) => item.id === product.id)
        if (existing) {
            existing.quantity++
        } else {
            cart.value.push({ ...product, quantity: 1 })
        }
    }

    function incrementQuantity(productId: number) {
        const item = cart.value.find((item) => item.id === productId)
        if (item) item.quantity++
    }

    function decrementQuantity(productId: number) {
        const itemIndex = cart.value.findIndex((item) => item.id === productId)
        if (itemIndex !== -1) {
            if (cart.value[itemIndex].quantity > 1) {
                cart.value[itemIndex].quantity--
            } else {
                cart.value.splice(itemIndex, 1) // Remove if quantity hits 0
            }
        }
    }

    function removeFromCart(productId: number) {
        cart.value = cart.value.filter((item) => item.id !== productId)
    }

    function clearCart() {
        cart.value = []
    }

    return {
        cart,
        products,
        cartTotal,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        clearCart
    }
})