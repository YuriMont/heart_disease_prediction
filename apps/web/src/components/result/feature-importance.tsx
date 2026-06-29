import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { FeatureImportance as FeatureImportanceType } from "../../generated/models/featureImportance";

interface FeatureImportanceProps {
  features: FeatureImportanceType[];
}

const COLORS = ["#1E63E9", "#0EA5C4", "#16A45F", "#E8930C", "#DC3848", "#7C3AED"];

export function FeatureImportance({ features }: FeatureImportanceProps) {
  const sorted = [...features].sort((a, b) => b.weight - a.weight);
  const chartHeight = sorted.length * 28;

  return (
    <Card className="flex flex-col gap-4 p-6">
      <CardHeader className="p-0">
        <CardTitle>Importância das Características</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis type="number" domain={[0, 1]} hide />
              <YAxis
                type="category"
                dataKey="variable"
                width={150}
                tick={{ fontSize: 12, fill: "#5A6B82" }}
              />
              <Bar dataKey="weight" radius={[0, 6, 6, 0]} barSize={16}>
                {sorted.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
