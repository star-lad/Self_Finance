import { useState } from "react";
import { db } from "../auth/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";

export default function AddExpense({ onExpenseAdded }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in to add expenses");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add the expense document with the user's ID
      await addDoc(collection(db, "expenses"), { 
        amount: parseFloat(amount), 
        category, 
        date,
        userId: user.id,
        createdAt: new Date()
      });
      
      // Clear form inputs
      setAmount("");
      setCategory("");
      setDate("");
      
      // Call the callback function to notify parent component
      if (onExpenseAdded && typeof onExpenseAdded === 'function') {
        onExpenseAdded();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="add-expense-container">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input 
            id="amount"
            type="number" 
            placeholder="Amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
            min="0.01"
            step="0.01"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Housing">Housing</option>
            <option value="Utilities">Utilities</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input 
            id="date"
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </>
  );
}
