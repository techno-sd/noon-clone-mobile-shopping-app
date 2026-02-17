import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ChevronRight as ChevronIcon } from 'lucide-react-native';
import { db } from '@/lib/db';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.from('categories').select().then(({ data }) => {
      setCategories(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color="black" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{item.name[0]}</Text>
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
            <ChevronIcon size={20} color="#7e859b" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  categoryRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f9f9f9' 
  },
  iconCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#f7f7f7', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15
  },
  iconText: { fontSize: 18, fontWeight: 'bold', color: '#feee00' },
  categoryName: { flex: 1, fontSize: 16, color: '#404553' }
});
