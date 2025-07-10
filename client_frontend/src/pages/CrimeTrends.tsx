
import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CrimeTrends: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState("month");
  const [areaFilter, setAreaFilter] = useState("all");
  
  // Mock data for charts
  const crimeByTypeData = [
    { name: 'Theft', value: 45 },
    { name: 'Accident', value: 28 },
    { name: 'Harassment', value: 17 },
    { name: 'Suspicious', value: 23 },
    { name: 'Robbery', value: 12 },
  ];

  const crimeByLocationData = [
    { name: 'Central', value: 35 },
    { name: 'North', value: 22 },
    { name: 'South', value: 18 },
    { name: 'East', value: 15 },
    { name: 'West', value: 25 },
  ];
  
  const crimeTrendData = [
    { name: 'Jan', theft: 12, accident: 9, harassment: 5, suspicious: 8 },
    { name: 'Feb', theft: 15, accident: 7, harassment: 6, suspicious: 7 },
    { name: 'Mar', theft: 18, accident: 8, harassment: 8, suspicious: 9 },
    { name: 'Apr', theft: 14, accident: 10, harassment: 7, suspicious: 12 },
    { name: 'May', theft: 9, accident: 6, harassment: 4, suspicious: 8 },
    { name: 'Jun', theft: 11, accident: 9, harassment: 9, suspicious: 6 },
  ];
  
  const monthlyTotalData = [
    { name: 'Jan', total: 34 },
    { name: 'Feb', total: 35 },
    { name: 'Mar', total: 43 },
    { name: 'Apr', total: 43 },
    { name: 'May', total: 27 },
    { name: 'Jun', total: 35 },
  ];
  
  const severityData = [
    { name: 'High', value: 25 },
    { name: 'Medium', value: 45 },
    { name: 'Low', value: 30 },
  ];
  
  const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF3365'];
  const SEVERITY_COLORS = ['#FF3333', '#FFBB28', '#00C49F'];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="Crime Trends" />
      
      <main className="flex-1 px-4 pb-20 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-raksha-secondary">Historical Crime Data</h2>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Time Period</label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Area</label>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="central">Central Delhi</SelectItem>
                <SelectItem value="north">North Delhi</SelectItem>
                <SelectItem value="south">South Delhi</SelectItem>
                <SelectItem value="east">East Delhi</SelectItem>
                <SelectItem value="west">West Delhi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Crime Charts */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 h-60">
              <h3 className="text-sm font-medium mb-3">Monthly Crime Statistics</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={monthlyTotalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 h-60">
                <h3 className="text-sm font-medium mb-3">Crime by Type</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={crimeByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={65}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name}) => name}
                    >
                      {crimeByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 h-60">
                <h3 className="text-sm font-medium mb-3">Severity Distribution</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={65}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name}) => name}
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="bg-white rounded-lg shadow-sm p-4 h-80">
              <h3 className="text-sm font-medium mb-3">Crime Trends Over Time</h3>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={crimeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="theft" stroke="#0088FE" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="accident" stroke="#00C49F" />
                  <Line type="monotone" dataKey="harassment" stroke="#FFBB28" />
                  <Line type="monotone" dataKey="suspicious" stroke="#FF8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution">
            <div className="bg-white rounded-lg shadow-sm p-4 h-60">
              <h3 className="text-sm font-medium mb-3">Crime by Location</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  data={crimeByLocationData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CrimeTrends;
