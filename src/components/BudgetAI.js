import { useEffect, useState } from "react";

export default function BudgetAI({ expenses }) {
  const [advice, setAdvice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdvice() {
      // Skip if no expenses
      if (!expenses || expenses.length === 0) {
        setAdvice("Add some expenses to get personalized budget advice.");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the backend API instead of direct OpenAI integration
        const response = await fetch('/api/budget-advice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('clerkToken')}` // Assume token is stored
          },
          body: JSON.stringify({
            expenses: expenses
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to get budget advice');
        }
        
        const data = await response.json();
        setAdvice(data.advice);
      } catch (error) {
        console.error("Error fetching AI advice:", error);
        setError("Unable to generate budget advice at this time.");
        setAdvice("");
      } finally {
        setIsLoading(false);
      }
    }

    if (expenses.length > 0) fetchAdvice();
  }, [expenses]);

  if (error) {
    return (
      <div className="ai-advice error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="ai-advice">
      {isLoading ? (
        <p>Analyzing your expenses...</p>
      ) : (
        <p>{advice}</p>
      )}
    </div>
  );
}
