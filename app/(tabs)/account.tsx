import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { User as UserIcon, Package as OrderIcon, MapPin as AddressIcon, CreditCard as PaymentIcon, Settings as SettingsIcon, LogOut as LogoutIcon } from 'lucide-react-native';

const MenuItem = ({ icon: Icon, title, subtitle }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuIcon}>
      <Icon size={24} color="#404553" />
    </View>
    <View style={styles.menuText}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
  </TouchableOpacity>
);

export default function AccountScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <UserIcon size={40} color="#7e859b" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>Guest User</Text>
        </View>
      </View>

      <View style={styles.section}>
        <MenuItem icon={OrderIcon} title="Orders" subtitle="Check your order status" />
        <MenuItem icon={AddressIcon} title="Addresses" subtitle="Manage your delivery addresses" />
        <MenuItem icon={PaymentIcon} title="Payments" subtitle="Manage your cards and credits" />
      </View>

      <View style={styles.section}>
        <MenuItem icon={SettingsIcon} title="Settings" />
        <MenuItem icon={LogoutIcon} title="Sign Out" />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  profileHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: '#feee00' 
  },
  avatar: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileInfo: { marginLeft: 15 },
  greeting: { fontSize: 14, color: '#404553' },
  userName: { fontSize: 20, fontWeight: 'bold', color: 'black' },
  section: { backgroundColor: 'white', marginTop: 15, paddingHorizontal: 15 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f1f1' 
  },
  menuIcon: { width: 40 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 16, color: '#404553', fontWeight: '500' },
  menuSubtitle: { fontSize: 12, color: '#7e859b', marginTop: 2 },
  footer: { padding: 30, alignItems: 'center' },
  version: { color: '#7e859b', fontSize: 12 }
});
