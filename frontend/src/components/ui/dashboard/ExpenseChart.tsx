"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [totalExpense, setTotalExpense] = useState(0);

  // Veriyi toplam tutara göre yüzdesel hesaplayarak hazırla
  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setTotalExpense(0);
      return;
    }
    
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    setTotalExpense(total);
    
    // En az %2'den büyük olanları ayrı göster, küçükleri "Diğer" altında birleştir
    const threshold = total * 0.02;
    const significantItems = data.filter(item => item.amount >= threshold);
    const smallItems = data.filter(item => item.amount < threshold);
    
    let processedData = [...significantItems];
    
    if (smallItems.length > 0) {
      const otherAmount = smallItems.reduce((sum, item) => sum + item.amount, 0);
      if (otherAmount > 0) {
        processedData.push({
          id: -1,
          name: "Diğer",
          amount: otherAmount,
          color: "#CCCCCC"
        });
      }
    }
    
    setChartData(processedData);
  }, [data]);

  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: currency || 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Yüzde formatı
  const formatPercent = (value: number) => {
    return `${Math.round(value * 100) / 100}%`;
  };

  // Özel tooltip içeriği
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.amount / totalExpense) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-md mb-1 border-b pb-1">{data.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(data.amount)}
            </span>
            {' '} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Özel etiket içeriği (Grafiğin üzerindeki yüzde değerleri)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    if (percent < 0.05) return null; // Çok küçük dilimleri etiketleme
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Kategori seçimi için tıklama işleyicisi
  const handleClick = (data: any, index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    setSelectedCategory(activeIndex === index ? null : data);
  };

  return (
    <Card className="col-span-1 md:col-span-2 p-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-950">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <CardTitle className="text-xl font-bold">Harcama Dağılımı</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 h-[300px] p-3">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Henüz harcama verisi bulunmamaktadır</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={3}
                    dataKey="amount"
                    onClick={handleClick}
                    animationDuration={1000}
                    animationBegin={0}
                    isAnimationActive={true}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={activeIndex === index ? "#fff" : "none"}
                        strokeWidth={activeIndex === index ? 2 : 0}
                        className="hover:opacity-85 transition-opacity"
                        style={{
                          filter: activeIndex === index ? "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3))" : "none",
                          cursor: "pointer"
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="md:w-1/3 p-5 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
            <h3 className="text-lg font-semibold mb-2">Kategori Dağılımı</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Toplam Harcama: <span className="font-bold text-gray-800 dark:text-gray-200">{formatCurrency(totalExpense)}</span>
            </p>
            
            <AnimatePresence>
              <div className="space-y-3 mt-2">
                {chartData.map((category, index) => (
                  <motion.div 
                    key={category.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      activeIndex === index ? "bg-gray-200 dark:bg-gray-800" : ""
                    }`}
                    onClick={() => handleClick(category, index)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium truncate max-w-[100px]">{category.name}</span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPercent((category.amount / totalExpense) * 100)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 