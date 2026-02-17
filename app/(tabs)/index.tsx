import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Search as SearchIcon, Star as StarIcon, ShoppingCart as CartIcon } from 'lucide-react-native';
import { db } from '@/lib/db';

const { width } = Dimensions.get('window');

interface Product {
  id: number;
  name: string;
  price: string;
  old_price: string;
  image_url: string;
  is_express: boolean;
  rating: string;
  reviews_count: number;
}

interface Category {
  id: number;
  name: string;
}

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        db.from('products').select().limit(10),
        db.from('categories').select().limit(6)
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToCart = async (productId: number) => {
    try {
      await db.from('cart_items').insert({ product_id: productId, quantity: 1 });
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <div style={styles.priceRow}>
          <Text style={styles.currency}>AED</Text>
          <Text style={styles.price}>{Number(item.price).toFixed(2)}</Text>
        </div>
        {item.old_price && (
          <Text style={styles.oldPrice}>AED {Number(item.old_price).toFixed(2)}</Text>
        )}
        <div style={styles.ratingRow}>
          <div style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{Number(item.rating).toFixed(1)}</Text>
            <StarIcon size={10} color="white" fill="white" />
          </div>
          <Text style={styles.reviewsText}>({item.reviews_count})</Text>
        </div>
        {item.is_express && (
          <div style={styles.expressBadge}>
            <Text style={styles.expressText}>express</Text>
          </div>
        )}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => addToCart(item.id)}
        >
          <CartIcon size={16} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#7e859b" style={styles.searchIcon} />
          <TextInput 
            placeholder="What are you looking for?" 
            style={styles.searchInput}
            placeholderTextColor="#7e859b"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5632382/pexels-photo-5632382.jpeg?auto=compress&cs=tinysrgb&w=800' }} 
            style={styles.bannerImage}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem}>
                <View style={styles.categoryIconCircle}>
                  <Text style={styles.categoryInitial}>{cat.name[0]}</Text>
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="black" style={{ margin: 20 }} />
          ) : (
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.productRow}
            />
          )}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    backgroundColor: '#feee00',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#404553' },
  bannerContainer: { padding: 15 },
  bannerImage: { width: '100%', height: 150, borderRadius: 8 },
  section: { paddingVertical: 15 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    marginBottom: 10
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#404553', paddingHorizontal: 15, marginBottom: 10 },
  viewAll: { color: '#3866df', fontWeight: '600' },
  categoryScroll: { paddingHorizontal: 10 },
  categoryItem: { alignItems: 'center', marginHorizontal: 8, width: 70 },
  categoryIconCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f1f1'
  },
  categoryInitial: { fontSize: 20, fontWeight: 'bold', color: '#feee00' },
  categoryName: { fontSize: 12, color: '#404553', marginTop: 5, textAlign: 'center' },
  productRow: { justifyContent: 'space-between', paddingHorizontal: 10 },
  productCard: {
    backgroundColor: 'white',
    width: (width - 30) / 2,
    marginBottom: 10,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f1f1',
    borderStyle: 'solid'
  },
  productImage: { width: '100%', height: 150, resizeMode: 'cover' },
  productInfo: { padding: 10 },
  productName: { fontSize: 13, color: '#404553', height: 36, marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  currency: { fontSize: 10, fontWeight: 'bold', marginRight: 2 },
  price: { fontSize: 16, fontWeight: 'bold' },
  oldPrice: { fontSize: 11, color: '#7e859b', textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#388e3c', 
    paddingHorizontal: 4, 
    paddingVertical: 2, 
    borderRadius: 2 
  },
  ratingText: { color: 'white', fontSize: 10, fontWeight: 'bold', marginRight: 2 },
  reviewsText: { fontSize: 10, color: '#7e859b', marginLeft: 4 },
  expressBadge: { 
    backgroundColor: '#feee00', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 4, 
    paddingVertical: 1, 
    borderRadius: 2,
    marginTop: 5
  },
  expressText: { fontSize: 9, fontWeight: 'bold', fontStyle: 'italic' },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#f1f1f1',
    padding: 6,
    borderRadius: 20
  }
});
