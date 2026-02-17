import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Trash2 as TrashIcon, ShoppingBag as BagIcon } from 'lucide-react-native';
import { db } from '@/lib/db';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: string;
  image_url: string;
}

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    const { data } = await db.from('cart_items').select('*, products(name, price, image_url)');
    
    // PGlite join simulation since the QB is simple
    const cartRes = await db.from('cart_items').select();
    const prodRes = await db.from('products').select();
    
    const enriched = (cartRes.data || []).map((item: any) => {
      const prod = (prodRes.data || []).find((p: any) => p.id === item.product_id);
      return { ...item, ...prod };
    });
    
    setItems(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const removeItem = async (id: number) => {
    await db.from('cart_items').delete().eq('id', id);
    fetchCart();
  };

  const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  if (loading) return <View style={styles.center}><ActivityIndicator color="black" /></View>;

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <BagIcon size={64} color="#7e859b" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Start shopping to add items to your cart</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart ({items.length})</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image_url }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>AED {Number(item.price).toFixed(2)}</Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
              <TrashIcon size={20} color="#ff4d4f" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>AED {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  list: { padding: 15 },
  cartItem: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12,
    alignItems: 'center'
  },
  itemImage: { width: 80, height: 80, borderRadius: 4 },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, color: '#404553', marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  itemQty: { fontSize: 12, color: '#7e859b', marginTop: 4 },
  removeBtn: { padding: 8 },
  footer: { backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderTopColor: '#f1f1f1' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 16, color: '#404553' },
  totalValue: { fontSize: 20, fontWeight: 'bold' },
  checkoutBtn: { backgroundColor: '#feee00', height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkoutText: { fontWeight: 'bold', fontSize: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#404553' },
  emptySubtitle: { fontSize: 14, color: '#7e859b', marginTop: 8, textAlign: 'center' }
});
