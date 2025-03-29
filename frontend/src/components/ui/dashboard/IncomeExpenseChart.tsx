"use client";

import { useState, useCallback } from "react";
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
  ComposedChart,
  Cell
} from "recharts";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

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

export function IncomeExpenseChart({ data = [], currency }: IncomeExpenseChartProps) {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Veri kontrolü
  const hasData = data.length > 0;
  
  // Renk paleti tanımlaması
  const colors = {
    income: {
      main: "#10B981", // Yeşil
      light: "#D1FAE5",
      dark: "#047857",
      gradient: ["#10B981", "#059669"]
    },
    expense: {
      main: "#EF4444", // Kırmızı
      light: "#FEE2E2",
      dark: "#B91C1C",
      gradient: ["#F87171", "#EF4444"]
    },
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

  // En yüksek gelir ve gider değerlerini bulmak için hesaplama - veri varsa hesapla
  const maxIncome = hasData ? Math.max(...data.map(item => item.income)) : 0;
  const maxExpense = hasData ? Math.max(...data.map(item => item.expense)) : 0;
  const maxValue = Math.max(maxIncome, maxExpense) * 1.2 || 1000; // Eğer 0 ise varsayılan 1000
  
  // Aylık toplam gelir ve gider hesaplama
  const totalIncome = hasData ? data.reduce((sum, item) => sum + item.income, 0) : 0;
  const totalExpense = hasData ? data.reduce((sum, item) => sum + item.expense, 0) : 0;
  const balance = totalIncome - totalExpense;

  // Önceki aya göre değişim hesaplama
  const getMonthlyChange = () => {
    if (!hasData || data.length < 2) return { income: "0.0", expense: "0.0" };
    
    const currentMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];
    
    const incomeChange = currentMonth.income - previousMonth.income;
    const expenseChange = currentMonth.expense - previousMonth.expense;
    
    const incomeChangePercent = previousMonth.income === 0 
      ? 0 
      : (incomeChange / previousMonth.income) * 100;
    
    const expenseChangePercent = previousMonth.expense === 0 
      ? 0 
      : (expenseChange / previousMonth.expense) * 100;
    
    return {
      income: incomeChangePercent.toFixed(1),
      expense: expenseChangePercent.toFixed(1)
    };
  };

  const monthlyChange = getMonthlyChange();

  const handleMouseEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

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
                {t('difference')}: 
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
    const { x, y, width, height, fill, dataKey, index } = props;
    const isActive = index === activeIndex;
    const radius = 6;
    
    const gradientId = dataKey === "income" ? "incomeBarGradient" : "expenseBarGradient";
    const shadowId = dataKey === "income" ? "incomeShadow" : "expenseShadow";
    
    return (
      <g>
        {isActive && (
          <rect
            x={x - 2}
            y={y - 2}
            width={width + 4}
            height={height + 4}
            fill="none"
            stroke={dataKey === "income" ? colors.income.main : colors.expense.main}
            strokeWidth={2}
            rx={radius + 2}
            ry={radius + 2}
            strokeDasharray="3 3"
            className="animate-pulse"
          />
        )}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#${gradientId})`}
          rx={radius}
          ry={radius}
          filter={isActive ? `url(#${shadowId})` : undefined}
          className={`transition-all duration-300 ease-out`}
          style={{
            transform: isActive ? 'translateY(-4px)' : 'none',
          }}
        />
      </g>
    );
  };

  return (
    <Card className="col-span-3 lg:col-span-2 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-col space-y-2 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">{t("incomeExpenseAnalysis")}</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              {t("monthlyComparison")}
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
              Line
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">{t("totalIncome")}</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-lg font-bold text-green-500">{formatCurrency(totalIncome)}</span>
              {monthlyChange.income !== "0.0" && (
                <span className={`text-xs pb-0.5 ${parseFloat(monthlyChange.income) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {parseFloat(monthlyChange.income) > 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
                  {parseFloat(monthlyChange.income) > 0 ? '+' : ''}{monthlyChange.income}%
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-md p-3">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{t("totalExpense")}</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-lg font-bold text-red-500">{formatCurrency(totalExpense)}</span>
              {monthlyChange.expense !== "0.0" && (
                <span className={`text-xs pb-0.5 ${parseFloat(monthlyChange.expense) < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {parseFloat(monthlyChange.expense) < 0 ? <ArrowDown className="inline h-3 w-3" /> : <ArrowUp className="inline h-3 w-3" />}
                  {parseFloat(monthlyChange.expense) > 0 ? '+' : ''}{monthlyChange.expense}%
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{t("balance")}</p>
            <div className="flex items-center mt-1">
              <span className={`text-lg font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2">
        <div className="h-[300px] w-full">
          {!hasData ? (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-center">{t("noTransactionsYet")}</p>
              <p className="text-muted-foreground text-sm mt-2 text-center px-4">
                {t("addTransactionsToSeeCharts")}
              </p>
            </div>
          ) : chartType === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                barGap={8}
              >
                <defs>
                  <linearGradient id="incomeBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.income.main} />
                    <stop offset="100%" stopColor={colors.income.light} />
                  </linearGradient>
                  <linearGradient id="expenseBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.expense.main} />
                    <stop offset="100%" stopColor={colors.expense.light} />
                  </linearGradient>
                  <filter id="incomeShadow" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={colors.income.main} floodOpacity="0.3" />
                  </filter>
                  <filter id="expenseShadow" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={colors.expense.main} floodOpacity="0.3" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: colors.text, fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: colors.text, fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                  domain={[0, maxValue]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => value === "income" ? t("income") : t("expense")} 
                  iconType="circle" 
                  iconSize={8}
                />
                <Bar 
                  dataKey="income" 
                  name={t("income")} 
                  fill={colors.income.main} 
                  shape={<CustomBar />}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                <Bar 
                  dataKey="expense" 
                  name={t("expense")} 
                  fill={colors.expense.main} 
                  shape={<CustomBar />}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data}
                margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.income.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors.income.main} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.expense.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors.expense.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: colors.text, fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: colors.text, fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                  domain={[0, maxValue]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => value === "income" ? t("income") : t("expense")} 
                  iconType="circle" 
                  iconSize={8}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name={t("income")}
                  stroke={colors.income.main} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: colors.income.main, strokeWidth: 2, stroke: colors.income.light }}
                  activeDot={{ r: 6, stroke: colors.income.main, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  name={t("expense")}
                  stroke={colors.expense.main} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: colors.expense.main, strokeWidth: 2, stroke: colors.expense.light }}
                  activeDot={{ r: 6, stroke: colors.expense.main, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 