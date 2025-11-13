/**
 * History Screen
 * Display user's order history and past purchases
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@shared/components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@shared/constants/theme';
import { useTheme } from '@shared/contexts';
import { formatCurrency } from '@shared/utils/format';

interface HistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  items: number;
  total: number;
  status: 'delivered' | 'processing' | 'cancelled';
  image: string;
}

// Mock data - replace with real data from API/storage
const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    items: 3,
    total: 289.97,
    status: 'delivered',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-10',
    items: 1,
    total: 129.99,
    status: 'delivered',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-05',
    items: 2,
    total: 199.98,
    status: 'processing',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400'
  }
];

export default function HistoryScreen() {
  const { colors } = useTheme();

  const getStatusColor = (status: HistoryItem['status']) => {
    switch (status) {
      case 'delivered':
        return colors.success.main;
      case 'processing':
        return colors.warning.main;
      case 'cancelled':
        return colors.error.main;
      default:
        return colors.neutral[500];
    }
  };

  const getStatusIcon = (status: HistoryItem['status']) => {
    switch (status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'processing':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <Card variant="elevated" padding="md" style={styles.historyCard}>
      <TouchableOpacity
        style={styles.historyContent}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={`Order ${item.orderNumber}`}
      >
        <Image
          source={{ uri: item.image }}
          style={[styles.thumbnail, { backgroundColor: colors.neutral[100] }]}
          resizeMode="cover"
        />

        <View style={styles.historyDetails}>
          <View style={styles.historyHeader}>
            <Text style={[styles.orderNumber, { color: colors.text.primary }]}>
              {item.orderNumber}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <Ionicons
                name={getStatusIcon(item.status)}
                size={14}
                color={getStatusColor(item.status)}
              />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={[styles.orderDate, { color: colors.text.secondary }]}>
            {new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>

          <View style={styles.orderMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="cube-outline" size={16} color={colors.text.tertiary} />
              <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
                {item.items} {item.items === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <Text style={[styles.orderTotal, { color: colors.primary[600] }]}>
              {formatCurrency(item.total)}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      </TouchableOpacity>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.neutral[100] }]}>
        <Ionicons name="receipt-outline" size={64} color={colors.neutral[400]} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
        No Order History
      </Text>
      <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
        Your past orders will appear here once you make a purchase
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Order History</Text>
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
          Track your past orders and purchases
        </Text>
      </View>

      <FlatList
        data={MOCK_HISTORY}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)'
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 120
  },
  historyCard: {
    marginBottom: SPACING.md
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md
  },
  historyDetails: {
    flex: 1,
    gap: SPACING.xs
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs
  },
  orderNumber: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  orderDate: {
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  orderTotal: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['3xl'],
    paddingHorizontal: SPACING.xl
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    maxWidth: 300
  }
});
