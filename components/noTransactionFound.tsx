import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '@/assets/styles/home.styles'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '@/constants/colors'
import { router } from 'expo-router'

const NoTransactionFound = () => {
  return (
    <View style={styles.emptyState}>
        <Ionicons name='receipt-outline' size={20} color={COLORS.textLight}/>
        <Text style={styles.emptyStateTitle}>No Transactions yet</Text>
        <Text style={styles.emptyStateText}>
           You can add your first transaction by tapping the add button.
        </Text>
        <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/create")}>
            <Ionicons name='add-circle' size={18} color={COLORS.white}/>
            <Text style={styles.emptyStateButtonText}>Add Transactions</Text>
        </TouchableOpacity>
    </View>
  )
}

export default NoTransactionFound