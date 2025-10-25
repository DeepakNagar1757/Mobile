import { use, useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "https://localhost:5002/api";

const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Summary, setSummary] = useState({
        balance : 0,
        income : 0,
        expense : 0
    })

    const fetchTransactions = useCallback( async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/user/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log("failed loading transactions", error);            
        }
    }, [userId]);


    const fetchSummary = useCallback( async () =>{
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.log("failed loading summary", error);            
        }
    },[userId]);

    const loadData = useCallback( async () =>{
        if (!userId) return;
        setLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.log("Error loading data : ", error);            
        } finally {
            setLoading(false);
        }
    },[fetchTransactions,fetchSummary,userId]);


    const deleteTransaction = useCallback( async (id) =>{
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {mehod: 'DELETE'});
            if (!response.ok) throw new Error("Failed to Delete Transaction");
            
            // Refresh transactions and summary after deletion
            loadData();
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            log("failed deleting transaction", error);
            Alert.alert("Error", "Failed to delete transaction");            
        }
    })

    return {
        transactions,
        loading,
        Summary,
        loadData,
        deleteTransaction
    }
}

export default useTransactions;