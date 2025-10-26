import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '@/assets/styles/home.styles'
import { COLORS } from '@/constants/colors'

const PageLoader = () => {
  return (
    <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={COLORS.primary}/>
    </SafeAreaView>
  )
}

export default PageLoader