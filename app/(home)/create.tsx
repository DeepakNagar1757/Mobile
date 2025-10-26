import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { API_URL } from '@/constants/api'
import { router } from 'expo-router'
import { styles } from '@/assets/styles/create.styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '@/constants/colors'

const CATEGORIES = [
    {id : "food", name: "Food & Drinks", icon : "fast-food"},
    {id : "shopping", name: "Shopping", icon : "cart"},
    {id : "transportation", name: "Transportation", icon : "car"},
    {id : "entertainment", name: "Entertainment", icon : "film"},
    {id : "bills", name: "Bills & Utilities", icon : "file-invoice-dollar"},
    {id : "income", name: "Income", icon : "cash"},
    {id : "other", name: "Other", icon : "elipsis-horizontal"},
]

const Create = () => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isExpense, setIsExpense] = useState(true);
    const [isLoading, setIsLoading] = useState(false)

    const {user} = useUser();

    const handleCreate = async () => {
        //Validation
        if(!title.trim()) return Alert.alert("Error","Please enter a valid title.");
        if(!amount || isNaN(Number(amount)) || Number(amount) <= 0) return Alert.alert("Error","Please enter a valid amount.");
        if(!selectedCategory) return Alert.alert("Error","Please select a category.");
        setIsLoading(true);

        // ensure user is available before using user.id
        if (!user) {
            setIsLoading(false);
            return Alert.alert("Error", "User not authenticated.");
        }

        try {
            //  formatting amount to income and expense
            const formattedAmount = isExpense ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

            const response = await fetch(`${API_URL}/transactions`, {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                  user_id: user.id,
                  title,
                  amount: formattedAmount,
                  category: selectedCategory  
                })
            });


            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create transaction");
            }

            Alert.alert("Success", "Transaction created succesfully")
            router.back();
        } catch (error) {
            console.log("Error creating a transaction: ",error);
            Alert.alert("Error","There was an error creating the transaction. Please try again.");                        
        } finally{
            setIsLoading(false);
        }


    }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name='arrow-back' size={24} color={COLORS.text}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]} onPress={handleCreate} disabled={isLoading}>
            <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
            {!isLoading && <Ionicons name='checkmark' size={18} color={COLORS.primary}/>}
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <View style={styles.card}>
        <View style={styles.typeSelector}>
            {/* EXPENSE SELECTOR */}
            <TouchableOpacity style={[styles.typeButton, isExpense && styles.typeButtonActive]} onPress={() => setIsExpense(true)}>
                <Ionicons name='arrow-down-circle' size={22} color={ isExpense ? COLORS.white : COLORS.expense}/>
                <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expense</Text>
            </TouchableOpacity>

            {/* INCOME SELECTOR */}
            <TouchableOpacity style={[styles.typeButton, !isExpense && styles.typeButtonActive]} onPress={() => setIsExpense(false)}>
                <Ionicons name='arrow-up-circle' size={22} color={ !isExpense ? COLORS.white : COLORS.income}/>
                <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>Income</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* AMOUNT CONTAINER */}
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>₹</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor={COLORS.textLight}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* INPUT CONTAINER */}
      <View style={styles.inputContainer}>
        <Ionicons name='create-outline' size={22} color={COLORS.textLight} style={styles.inputIcon}/>
        <TextInput
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
        />
      </View>

      {/* TITLE */}
      <Text style={styles.sectionTitle}>
        <Ionicons name='pricetag-outline' size={16} color={COLORS.text}/>
        Category
      </Text>


      <View style={styles.categoryGrid}>
        {CATEGORIES.map((category) => (
            <TouchableOpacity 
                style={[styles.categoryButton, selectedCategory === category.name && styles.categoryButtonActive]}
                key={category.id} 
                onPress={() => setSelectedCategory(category.name)}
            >
                <Ionicons name={category.icon as any} size={20} color={selectedCategory === category.name ? COLORS.white : COLORS.textLight} />
                <Text style={[styles.categoryButtonText, selectedCategory === category.name && styles.categoryButtonTextActive]}>{category.name}</Text>
            </TouchableOpacity>
        ))}
      </View>


      {isLoading && (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={20} color={COLORS.primary}/>            
        </View>
      )}
    </SafeAreaView>
  )
}

export default Create