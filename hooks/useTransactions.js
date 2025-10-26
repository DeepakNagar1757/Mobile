import { useCallback, useState, useRef } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });

  const inFlight = useRef(false);

  const fetchWithRetries = useCallback(
    async (url, options = {}, maxRetries = 3) => {
      let attempt = 0;
      let backoff = 500;
      while (attempt <= maxRetries) {
        const res = await fetch(url, options);
        const text = await res.text();
        console.log(`[useTransactions] ${url} status:`, res.status, text);
        if (res.ok) {
          try {
            return JSON.parse(text);
          } catch (e) {
            throw new Error(`Invalid JSON from ${url}: ${text.slice(0, 200)}`);
          }
        }
        if (res.status === 429 && attempt < maxRetries) {
          // backoff then retry
          await sleep(backoff);
          backoff *= 2;
          attempt += 1;
          continue;
        }
        // other error or exhausted retries
        throw new Error(`Server ${res.status}: ${text}`);
      }
      throw new Error("Retries exhausted");
    },
    []
  );

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      const url = `${API_URL}/transactions/${userId}`;
      const data = await fetchWithRetries(url, {
        headers: { "Content-Type": "application/json", "x-user-id": userId },
      });
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("failed loading transactions", err);
      setError(err);
    }
  }, [userId, fetchWithRetries]);

  const fetchSummary = useCallback(async () => {
    if (!userId) return;
    try {
      const url = `${API_URL}/transactions/summary/${userId}`;
      const data = await fetchWithRetries(url, {
        headers: { "Content-Type": "application/json", "x-user-id": userId },
      });
      setSummary(data || Summary);
    } catch (err) {
      console.log("failed loading summary", err);
      setError(err);
    }
  }, [userId, fetchWithRetries]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    if (inFlight.current) return; // prevent concurrent calls
    inFlight.current = true;
    setLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (err) {
      console.log("Error loading data : ", err);
      setError(err);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, [userId, fetchTransactions, fetchSummary]);

  const deleteTransaction = useCallback(
    async (id) => {
      if (!id) return;
      try {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "x-user-id": userId },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to Delete Transaction: ${res.status} ${txt}`);
        }
        await loadData();
        Alert.alert("Success", "Transaction deleted successfully");
      } catch (err) {
        console.log("failed deleting transaction", err);
        Alert.alert("Error", "Failed to delete transaction");
      }
    },
    [loadData, userId]
  );

  return {
    transactions,
    loading,
    Summary,
    loadData,
    deleteTransaction,
    error,
  };
};

export default useTransactions;