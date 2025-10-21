import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Download, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const ReportsGenerator = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<"payments" | "enrollments" | "users">("payments");
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("month");

  const { data: reportData } = useQuery({
    queryKey: ["report-data", reportType, dateRange],
    queryFn: async () => {
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === "week") startDate.setDate(now.getDate() - 7);
      else if (dateRange === "month") startDate.setMonth(now.getMonth() - 1);
      else if (dateRange === "year") startDate.setFullYear(now.getFullYear() - 1);

      if (reportType === "payments") {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .gte("created_at", startDate.toISOString())
          .eq("status", "success");
        
        if (error) throw error;
        
        const total = data.reduce((sum, p) => sum + Number(p.amount), 0);
        const count = data.length;
        
        return { total, count, data };
      } else if (reportType === "enrollments") {
        const { data, error } = await supabase
          .from("enrollments")
          .select("*")
          .gte("enrolled_at", startDate.toISOString());
        
        if (error) throw error;
        return { count: data.length, data };
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .gte("created_at", startDate.toISOString());
        
        if (error) throw error;
        return { count: data.length, data };
      }
    },
  });

  const handleExport = () => {
    if (!reportData?.data) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }

    const csvContent = generateCSV(reportData.data, reportType);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report_${dateRange}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast({ title: "Report exported successfully" });
  };

  const generateCSV = (data: any[], type: string) => {
    if (type === "payments") {
      const headers = ["Reference", "Amount", "Currency", "Status", "Date"];
      const rows = data.map(p => [
        p.reference,
        p.amount,
        p.currency,
        p.status,
        new Date(p.created_at).toLocaleDateString()
      ]);
      return [headers, ...rows].map(row => row.join(",")).join("\n");
    }
    return "";
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle>Reports Generator</CardTitle>
            <CardDescription>Generate and export detailed reports</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger id="report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payments">Payment Summary</SelectItem>
                <SelectItem value="enrollments">Enrollment Statistics</SelectItem>
                <SelectItem value="users">User Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
              <SelectTrigger id="date-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {reportData && (
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">Report Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {dateRange === "week" ? "Last 7 days" : dateRange === "month" ? "Last 30 days" : "Last year"}
                </p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{reportData.count}</p>
              </div>
              {reportType === "payments" && "total" in reportData && (
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">KES {reportData.total.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <Button onClick={handleExport} className="w-full" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export Report as CSV
        </Button>
      </CardContent>
    </Card>
  );
};
