import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, router } from 'expo-router'
import { Alert, FlatList, RefreshControl, Text, Touchable, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import useTransactions from "@/hooks/useTransactions"
import { useEffect, useState } from 'react'
import PageLoader from '@/components/pageLoader'
import { styles } from '@/assets/styles/home.styles'
import { Image } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons'
import BalanceCard from '@/components/balanceCard'
import TransactionItem from '@/components/transactionItem'
import NoTransactionFound from '@/components/noTransactionFound'


export default function Page() {
  const { user } = useUser()
  const [refreshing, setRefreshing] = useState(false);
  const { transactions, Summary, deleteTransaction, loadData, loading } = useTransactions(user?.id);

  console.log(transactions);
  

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  }, [loadData])

  if (loading && !refreshing) return <PageLoader />

  const handleDelete = async (transactionId: string) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          await deleteTransaction(transactionId)
        }
      }
    ])
  }

  console.log('Rendering FlatList with transactions:', transactions)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image source={require('@/assets/images/logo.png')} style={styles.headerLogo} resizeMode='contain' />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>{user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => { router.push('/create') }}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* CONTENT */}
        <BalanceCard summary={Summary}/>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        keyExtractor={(item: any) => String(item.id)}
        data={transactions}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }: { item: any }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={() => (
          <NoTransactionFound />
        )}
      />
    </SafeAreaView>
  )
}