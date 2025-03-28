"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface IncomeExpenseChartProps {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  // Renk paleti tanımlaması
  const colors = {
    income: "#10B981", // Yeşil
    expense: "#EF4444", // Kırmızı
    background: "#F9FAFB",
    grid: "#E5E7EB",
    text: "#6B7280"
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(value);
  };

  // En yüksek gelir ve gider değerlerini bulmak için hesaplama
  const maxIncome = Math.max(...data.map(item => item.income));
  const maxExpense = Math.max(...data.map(item => item.expense));
  const maxValue = Math.max(maxIncome, maxExpense);
  
  // Aylık toplam gelir ve gider hesaplama
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  const balance = totalIncome - totalExpense;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-sm">
                <span className="font-medium">{entry.name}: </span>
                {formatCurrency(entry.value)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-4 xl:col-span-3 shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Gelir & Gider Analizi</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
            Aylık gelir ve gider karşılaştırması
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm"
            variant={chartType === "bar" ? "default" : "outline"}
            className={`h-8 px-3 ${chartType === "bar" ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-gray-300 dark:border-gray-700"}`}
            onClick={() => setChartType("bar")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <rect x="3" y="8" width="4" height="12"></rect>
              <rect x="10" y="4" width="4" height="16"></rect>
              <rect x="17" y="12" width="4" height="8"></rect>
            </svg>
            Bar
          </Button>
          <Button 
            size="sm"
            variant={chartType === "line" ? "default" : "outline"}
            className={`h-8 px-3 ${chartType === "line" ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-gray-300 dark:border-gray-700"}`}
            onClick={() => setChartType("line")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            Çizgi
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Toplam Gelir</span>
            <span className="text-xl font-bold text-green-500">{formatCurrency(totalIncome)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Toplam Gider</span>
            <span className="text-xl font-bold text-red-500">{formatCurrency(totalExpense)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Net Bakiye</span>
            <span className={`text-xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
        <div className="p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 20,
                }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: colors.text, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.grid }}
                />
                <YAxis 
                  tickFormatter={(value) => `₺${value / 1000}K`}
                  tick={{ fill: colors.text, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.grid }}
                  domain={[0, maxValue * 1.1]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => <span className="capitalize text-sm font-medium">{value === "income" ? "Gelir" : "Gider"}</span>}
                />
                <Bar 
                  name="Gelir" 
                  dataKey="income" 
                  fill={colors.income}
                  radius={[4, 4, 0, 0]} 
                  barSize={24}
                  animationDuration={1500}
                />
                <Bar 
                  name="Gider" 
                  dataKey="expense" 
                  fill={colors.expense}
                  radius={[4, 4, 0, 0]} 
                  barSize={24}
                  animationDuration={1500}
                />
              </BarChart>
            ) : (
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: colors.text, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.grid }}
                />
                <YAxis 
                  tickFormatter={(value) => `₺${value / 1000}K`}
                  tick={{ fill: colors.text, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.grid }}
                  domain={[0, maxValue * 1.1]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => <span className="capitalize text-sm font-medium">{value === "income" ? "Gelir" : "Gider"}</span>}
                />
                <Line 
                  name="Gelir" 
                  type="monotone" 
                  dataKey="income" 
                  stroke={colors.income} 
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ stroke: colors.income, strokeWidth: 2, r: 4, fill: 'white' }}
                  animationDuration={1500}
                />
                <Line 
                  name="Gider" 
                  type="monotone" 
                  dataKey="expense" 
                  stroke={colors.expense} 
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ stroke: colors.expense, strokeWidth: 2, r: 4, fill: 'white' }}
                  animationDuration={1500}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 