import { useState, useEffect, useCallback } from "react";
import { db } from "../auth/firebaseConfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import AddExpense from "./AddExpense";
import ExpenseChart from "./ExpenseChart";
import BudgetAI from "./BudgetAI";
import "./dashboard-css.css";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Create a fetchExpenses function using useCallback to prevent unnecessary re-renders
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the user ID from Clerk to filter expenses
      const userId = user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      // Query expenses for this specific user
      const expensesQuery = query(
        collection(db, "expenses"), 
        where("userId", "==", userId),
        orderBy("date", "desc")
      );
      
      const querySnapshot = await getDocs(expensesQuery);
      const expensesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch expenses when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, fetchExpenses]);

  // Handle checking for bill reminders separately from rendering
  useEffect(() => {
    // Function to check for due bills and send reminders
    const checkBillReminders = async () => {
      if (!user || !expenses.length) return;
      
      // This should be implemented as a backend function
      // We're just logging it here as a placeholder
      const today = new Date().toISOString().split('T')[0];
      const dueBills = expenses.filter(
        expense => expense.category === "Bills" && expense.date === today
      );
      
      if (dueBills.length > 0) {
        console.log("Bills due today:", dueBills);
        // Reminders should be sent from a server, not the client
        // sendReminder would be called on the server
      }
    };
    
    checkBillReminders();
  }, [expenses, user]);

  const handleExpenseAdded = () => {
    fetchExpenses();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return (
      <div className="dashboard">
        <h1>Personal Finance Dashboard</h1>
        <div className="card">
          <div className="card-body error-message">
            <p>{error}</p>
            <button onClick={fetchExpenses}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Personal Finance Dashboard</h1>
      
      <div className="card expense-form">
        <div className="card-header">
          <h2>Add New Expense</h2>
        </div>
        <div className="card-body">
          <AddExpense onExpenseAdded={handleExpenseAdded} />
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading your financial data...</div>
      ) : expenses.length > 0 ? (
        <>
          <div className="card">
            <div className="card-header">
              <h2>Expense Breakdown</h2>
            </div>
            <div className="card-body">
              <ExpenseChart expenses={expenses} />
            </div>
          </div>
          
          <div className="card budget-advice">
            <div className="card-header">
              <h2>Budget Recommendations</h2>
            </div>
            <div className="card-body">
              <BudgetAI expenses={expenses} />
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2>Recent Expenses</h2>
            </div>
            <div className="card-body expense-list">
              <ul>
                {expenses.map(expense => (
                  <li key={expense.id}>
                    <div className="expense-info">
                      <span className="expense-category">{expense.category}</span>
                      <span className="expense-date">{formatDate(expense.date)}</span>
                    </div>
                    <span className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="card-body">
            <p className="no-data">No expenses recorded yet. Add your first expense above!</p>
          </div>
        </div>
      )}
    </div>
  );
}
