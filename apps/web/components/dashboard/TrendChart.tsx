"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  date: string;
  income: number;
  expense: number;
  net: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  // Format currency in Naira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full h-[320px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
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
            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F5132" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0F5132" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38C186" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#38C186" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(92, 110, 98, 0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#5C6E62"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#5C6E62"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₦${value / 1000}k`}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card-bg, #ffffff)",
              border: "1px solid rgba(92, 110, 98, 0.2)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
            formatter={(value: any, name: string) => [
              formatCurrency(Number(value)),
              name === "net" ? "Net Revenue" : name === "income" ? "Total Income" : "Total Expense",
            ]}
            labelStyle={{
              color: "#17221A",
              fontWeight: "600",
              fontSize: "12px",
              marginBottom: "4px",
            }}
          />
          <Area
            name="income"
            type="monotone"
            dataKey="income"
            stroke="#38C186"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            name="net"
            type="monotone"
            dataKey="net"
            stroke="#0F5132"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorNet)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
