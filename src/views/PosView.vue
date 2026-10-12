<script setup lang="ts">
import { usePosStore } from '@/stores/usePosStore'

const posStore = usePosStore()
</script>

<template>
  <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column: Products Grid -->
    <div class="lg:col-span-2">
      <h1 class="text-2xl font-bold mb-4">POS Items</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div 
          v-for="product in posStore.products" 
          :key="product.id"
          class="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          @click="posStore.addToCart(product)"
        >
          <div>
            <h3 class="font-bold text-lg text-slate-800">{{ product.name }}</h3>
            <p class="text-gray-500 font-medium">${{ product.price.toFixed(2) }}</p>
          </div>
          <button 
            class="mt-4 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 active:scale-95 transition"
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>

    <!-- Right Column: Itemized Shopping Cart -->
    <div class="bg-white p-5 rounded-lg border shadow-sm flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h2 class="text-xl font-bold text-slate-800">Current Order</h2>
          <button 
            v-if="posStore.cart.length > 0"
            @click="posStore.clearCart()"
            class="text-xs text-red-500 hover:text-red-700 font-semibold"
          >
            Clear All
          </button>
        </div>

        <!-- Empty Cart State -->
        <div v-if="posStore.cart.length === 0" class="py-12 text-center text-gray-400">
          No items added to order yet.
        </div>

        <!-- Itemized Cart List -->
        <div v-else class="space-y-3">
          <div 
            v-for="item in posStore.cart" 
            :key="item.id"
            class="flex items-center justify-between p-2.5 bg-gray-50 rounded-md border"
          >
            <div>
              <p class="font-semibold text-slate-800">{{ item.name }}</p>
              <p class="text-xs text-gray-500">${{ item.price.toFixed(2) }} each</p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center gap-2">
              <div class="flex items-center border rounded bg-white">
                <button 
                  @click.stop="posStore.decrementQuantity(item.id)"
                  class="px-2 py-0.5 text-gray-600 hover:bg-gray-100 rounded-l"
                >
                  -
                </button>
                <span class="px-2 text-sm font-semibold">{{ item.quantity }}</span>
                <button 
                  @click.stop="posStore.incrementQuantity(item.id)"
                  class="px-2 py-0.5 text-gray-600 hover:bg-gray-100 rounded-r"
                >
                  +
                </button>
              </div>

              <span class="font-bold text-sm w-14 text-right">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </span>

              <button 
                @click.stop="posStore.removeFromCart(item.id)"
                class="text-gray-400 hover:text-red-500 text-sm ml-1"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary & Checkout -->
      <div class="border-t pt-4 mt-6">
        <div class="flex justify-between items-center mb-2 text-gray-600">
          <span>Items Count:</span>
          <span>{{ posStore.cart.reduce((total, i) => total + i.quantity, 0) }}</span>
        </div>
        <div class="flex justify-between items-center text-xl font-bold text-slate-900 mb-4">
          <span>Total Amount:</span>
          <span>${{ posStore.cartTotal.toFixed(2) }}</span>
        </div>
        <button 
          :disabled="posStore.cart.length === 0"
          class="w-full py-3 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Complete Sale
        </button>
      </div>
    </div>
  </div>
</template>
