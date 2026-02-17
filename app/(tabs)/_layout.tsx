import { Tabs } from 'expo-router';
import { Home as HomeIcon, LayoutGrid as CategoryIcon, ShoppingCart as CartIcon, User as UserIcon } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#feee00',
      tabBarInactiveTintColor: '#7e859b',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f1f1',
        height: 60,
        paddingBottom: 8,
      },
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => <CategoryIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <CartIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
