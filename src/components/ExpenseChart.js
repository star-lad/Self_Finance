import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function ExpenseChart({ expenses }) {
  // Group expenses by category and calculate totals
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(expense.amount);
    return acc;
  }, {});

  // Convert to format for chart
  const chartData = Object.keys(expensesByCategory).map(category => ({
    name: category,
    value: expensesByCategory[category]
  }));

  // Sort by value (highest to lowest)
  chartData.sort((a, b) => b.value - a.value);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6B6B', '#4ECDC4', '#C7F464', '#81D8D0'];

  // Format currency
  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="chart-container">
      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatCurrency} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="expense-summary">
            <h3>Expense Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((category, index) => {
                  const totalExpenses = chartData.reduce((acc, curr) => acc + curr.value, 0);
                  const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
                  
                  return (
                    <tr key={index}>
                      <td>
                        <span className="color-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        {category.name}
                      </td>
                      <td>{formatCurrency(category.value)}</td>
                      <td>{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="no-data">No expense data available to display chart</div>
      )}
    </div>
  );
}
