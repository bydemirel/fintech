"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line, 
  Area,
  AreaChart,
  ComposedChart
} from "recharts";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

interface IncomeExpenseChartProps {
  data: MonthlyData[];
  currency: string;
}

type ChartType = "bar" | "line" | "area" | "composed";

export function IncomeExpenseChart({ data, currency }: IncomeExpenseChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  // Renk paleti tanımlaması
  const colors = {
    income: {
      main: "#10B981", // Yeşil
      light: "#D1FAE5",
      dark: "#047857"
    },
    expense: {
      main: "#EF4444", // Kırmızı
      light: "#FEE2E2",
      dark: "#B91C1C"
    },
    background: "#F9FAFB",
    grid: "#E5E7EB",
    text: "#6B7280"
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency || 'TRY',
      minimumFractionDigits: 0
    }).format(value);
  };

  // En yüksek gelir ve gider değerlerini bulmak için hesaplama
  const maxIncome = Math.max(...data.map(item => item.income));
  const maxExpense = Math.max(...data.map(item => item.expense));
  const maxValue = Math.max(maxIncome, maxExpense) * 1.2;
  
  // Aylık toplam gelir ve gider hesaplama
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  const balance = totalIncome - totalExpense;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-sm">
                <span className="font-medium text-gray-800 dark:text-gray-200">{entry.name}: </span>
                {formatCurrency(entry.value)}
              </p>
            </div>
          ))}
          {payload.length > 1 && (
            <div className="mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium">
                Fark: 
                <span className={`ml-1 ${payload[0].value > payload[1].value ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(payload[0].value - payload[1].value)}
                </span>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Barchart için özel şekil
  const CustomBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={8}
          ry={8}
          className={`transition-all duration-200 ease-in-out ${isHovered ? 'filter brightness-90' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ filter: isHovered ? 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))' : '' }}
        />
      </g>
    );
  };

  return (
    <Card className="col-span-3 lg:col-span-2 overflow-hidden border border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-xl font-bold">Gelir & Gider Analizi</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Aylık gelir ve gider karşılaştırması
          </CardDescription>
        </div>
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant={chartType === "bar" ? "default" : "outline"}
            className="text-xs h-8 px-2"
            onClick={() => setChartType("bar")}
          >
            Bar
          </Button>
          <Button 
            size="sm" 
            variant={chartType === "line" ? "default" : "outline"}
            className="text-xs h-8 px-2"
            onClick={() => setChartType("line")}
          >
            Çizgi
          </Button>
          <Button 
            size="sm" 
            variant={chartType === "area" ? "default" : "outline"}
            className="text-xs h-8 px-2"
            onClick={() => setChartType("area")}
          >
            Alan
          </Button>
          <Button 
            size="sm" 
            variant={chartType === "composed" ? "default" : "outline"}
            className="text-xs h-8 px-2"
            onClick={() => setChartType("composed")}
          >
            Karma
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Toplam Gelir</span>
            <span className="text-lg font-bold text-green-500">{formatCurrency(totalIncome)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Toplam Gider</span>
            <span className="text-lg font-bold text-red-500">{formatCurrency(totalExpense)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Net Bakiye</span>
            <span className={`text-lg font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
        <div className="p-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" && (
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
                barGap={8}
              >
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.income.main} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={colors.income.main} stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.expense.main} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={colors.expense.main} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} opacity={0.3} />
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
                  domain={[0, maxValue]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value: any) => {
                    return (
                      <span className="capitalize text-sm font-medium">
                        {value === "income" ? "Gelir" : "Gider"}
                      </span>
                    );
                  }}
                />
                <Bar 
                  name="Gelir" 
                  dataKey="income" 
                  fill="url(#incomeGradient)"
                  shape={<CustomBar />}
                  barSize={28}
                  animationDuration={1000}
                  isAnimationActive={true}
                />
                <Bar 
                  name="Gider" 
                  dataKey="expense" 
                  fill="url(#expenseGradient)" 
                  shape={<CustomBar />}
                  barSize={28}
                  animationDuration={1000}
                  isAnimationActive={true}
                />
              </BarChart>
            )}
            
            {chartType === "line" && (
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.3} />
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
                  domain={[0, maxValue]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value: any) => {
                    return (
                      <span className="capitalize text-sm font-medium">
                        {value === "income" ? "Gelir" : "Gider"}
                      </span>
                    );
                  }}
                />
                <Line 
                  name="Gelir" 
                  type="monotone" 
                  dataKey="income" 
                  stroke={colors.income.main} 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: colors.income.main, stroke: "#fff", strokeWidth: 2 }}
                  dot={{ fill: colors.income.light, stroke: colors.income.main, strokeWidth: 2, r: 5 }}
                  animationDuration={1000}
                  isAnimationActive={true}
                />
                <Line 
                  name="Gider" 
                  type="monotone" 
                  dataKey="expense" 
                  stroke={colors.expense.main} 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: colors.expense.main, stroke: "#fff", strokeWidth: 2 }}
                  dot={{ fill: colors.expense.light, stroke: colors.expense.main, strokeWidth: 2, r: 5 }}
                  animationDuration={1000}
                  isAnimationActive={true}
                />
              </LineChart>
            )}
            
            {chartType === "area" && (
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="incomeGradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.income.main} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={colors.income.main} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="expenseGradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.expense.main} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={colors.expense.main} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.3} />
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
                  domain={[0, maxValue]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value: any) => {
                    return (
                      <span className="capitalize text-sm font-medium">
                        {value === "income" ? "Gelir" : "Gider"}
                      </span>
                    );
                  }}
                />
                <Area 
                  name="Gelir" 
                  type="monotone" 
                  dataKey="income" 
                  stroke={colors.income.main} 
                  strokeWidth={2}
                  fill="url(#incomeGradientArea)"
                  activeDot={{ r: 6, fill: colors.income.main, stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={1000}
                  isAnimationActive={true}
                />
                <Area 
                  name="Gider" 
                  type="monotone" 
                  dataKey="expense" 
                  stroke={colors.expense.main} 
                  strokeWidth={2}
                  fill="url(#expenseGradientArea)"
                  activeDot={{ r: 6, fill: colors.expense.main, stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={1000}
                  isAnimationActive={true}
                />
              </AreaChart>
            )}
            
            {chartType === "composed" && (
              <ComposedChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="incomeGradientBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.income.main} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={colors.income.main} stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.3} />
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
                  domain={[0, maxValue]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value: any) => {
                    return (
                      <span className="capitalize text-sm font-medium">
                        {value === "income" ? "Gelir" : "Gider"}
                      </span>
                    );
                  }}
                />
                <Bar 
                  name="Gelir" 
                  dataKey="income" 
                  barSize={20} 
                  fill="url(#incomeGradientBar)"
                  shape={<CustomBar />}
                  animationDuration={1000}
                  isAnimationActive={true}
                />
                <Line 
                  name="Gider" 
                  type="monotone" 
                  dataKey="expense" 
                  stroke={colors.expense.main}
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: colors.expense.main, stroke: "#fff", strokeWidth: 2 }}
                  dot={{ fill: colors.expense.light, stroke: colors.expense.main, strokeWidth: 2, r: 5 }}
                  animationDuration={1000}
                  isAnimationActive={true}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 