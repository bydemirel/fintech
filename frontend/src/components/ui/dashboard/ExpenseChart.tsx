"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";

interface CategoryData {
  id: number;
  name: string;
  amount: number;
  color: string;
}

interface ExpenseChartProps {
  data: CategoryData[];
  currency: string;
}

export function ExpenseChart({ data, currency }: ExpenseChartProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  // Boş veri kontrolü
  if (data.length === 0) {
    return (
      <Card className="col-span-1 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">{t('expenseAnalysis')}</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            {t('expensesByCategory')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-1">
          <div className="h-[300px] w-full flex flex-col items-center justify-center">
            <p className="text-muted-foreground text-center">{t('noTransactionsYet')}</p>
            <p className="text-muted-foreground text-sm mt-2 text-center px-4">
              {t('addTransactionsToSeeCharts')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Toplam harcama
  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);
  
  // Özel tooltip bileşeni
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.amount / totalExpense) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
            <p className="font-medium">{data.name}</p>
          </div>
          <p className="text-sm font-bold">{formatCurrency(data.amount)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">%{percentage}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Özel etiket bileşeni
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  
  return (
    <Card className="col-span-1 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{t('expenseAnalysis')}</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          {t('expensesByCategory')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                align="right"
                verticalAlign="middle"
                iconSize={10}
                iconType="circle"
                formatter={(value) => {
                  // Basitçe değeri geri döndür
                  return <span className="text-xs font-medium">{value}</span>;
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="amount"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                animationDuration={800}
                animationBegin={100}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={index === activeIndex ? "#fff" : "none"}
                    strokeWidth={index === activeIndex ? 2 : 0}
                    className="transition-all duration-200"
                    style={{
                      filter: index === activeIndex ? "brightness(1.1) drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3))" : "none",
                      transform: index === activeIndex ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center center",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('totalExpense')}: <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalExpense)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 