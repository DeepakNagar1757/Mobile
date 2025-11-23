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
      // safer: only update summary if server returned a valid object
      setSummary((prev) => data ?? prev);
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
      // optimistic update: remove from local state immediately and adjust summary,
      // then perform server delete. If the delete fails, rollback and notify user.
      let prevTransactions;
      let prevSummary = Summary;
      // capture previous transactions and remove the item optimistically
      setTransactions((prev) => {
        prevTransactions = prev;
        return Array.isArray(prev) ? prev.filter((t) => String(t.id) !== String(id)) : [];
      });

      // compute deleted amount from previous transactions (if available)
      const deletedItem = prevTransactions ? prevTransactions.find((t) => String(t.id) === String(id)) : null;
      const deletedAmt = deletedItem ? parseFloat(String(deletedItem.amount)) || 0 : 0;

      // update summary locally
      setSummary((prev) => {
        const prevBalance = parseFloat(String(prev.balance)) || 0;
        const prevIncome = parseFloat(String(prev.income)) || 0;
        const prevExpense = parseFloat(String(prev.expense)) || 0;

        const newBalance = prevBalance - deletedAmt;
        let newIncome = prevIncome;
        let newExpense = prevExpense;
        if (deletedAmt > 0) {
          newIncome = prevIncome - deletedAmt;
        } else {
          // expenses are stored as negative amounts on the server
          newExpense = prevExpense - deletedAmt;
        }

        return {
          balance: newBalance.toFixed(2),
          income: newIncome.toFixed(2),
          expense: newExpense.toFixed(2),
        };
      });

      try {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "x-user-id": userId },
        });
        if (!res.ok) {
          const txt = await res.text();
          // rollback local state
          setTransactions(() => prevTransactions || []);
          setSummary(() => prevSummary || { balance: 0, income: 0, expense: 0 });
          throw new Error(`Failed to Delete Transaction: ${res.status} ${txt}`);
        }
        // success: no further action (we already updated UI optimistically)
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