"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
}

interface FilterFormProps {
  categories: Category[];
  onFilter: (filters: {
    startDate?: string;
    endDate?: string;
    categoryId?: number;
    type?: "income" | "expense";
  }) => void;
}

export function FilterForm({ categories, onFilter }: FilterFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      type: type as "income" | "expense" | undefined,
    });
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setCategoryId(undefined);
    setType(undefined);
    onFilter({});
  };

  return (
    <Card className="col-span-3 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md">
      <CardHeader 
        className="flex flex-row items-center justify-between p-4 pb-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          İşlemleri Filtrele
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </Button>
      </CardHeader>
      <CardContent className={`p-4 transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'h-0 p-0' : 'h-auto'}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Başlangıç Tarihi
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">
                Bitiş Tarihi
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                İşlem Türü
              </Label>
              <Select
                value={type}
                onValueChange={setType}
              >
                <SelectTrigger id="type" className="rounded-md">
                  <SelectValue placeholder="Tüm İşlemler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Gelir</SelectItem>
                  <SelectItem value="expense">Gider</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Kategori
              </Label>
              <Select 
                value={categoryId} 
                onValueChange={setCategoryId}
              >
                <SelectTrigger id="category" className="rounded-md">
                  <SelectValue placeholder="Tüm Kategoriler" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Temizle
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Filtrele
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 