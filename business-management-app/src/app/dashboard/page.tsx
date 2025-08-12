'use client';
import Card from '@/components/Card/Card';
import ProductListTable from '@/components/ProductListTable/ProductListTable';
import useFetchList from '@/hooks/useFetchList';
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, BarChart3 } from 'lucide-react';
import QuickAction from '@/components/QuickAction/QuickAction';

function DashboardPage() {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const { data: products, loading, error } = useFetchList("products", "stock=low-out");

  // Mock data for business metrics - replace with real data from your API
  const businessMetrics = [
    {
      title: 'Total Revenue',
      value: '$124,563.00',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Total Sales',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Products Sold',
      value: '5,678',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+3.1%',
      trend: 'up',
      icon: Users,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const quickActions: Array<{
    title: string;
    description: string;
    icon: 'Package' | 'BarChart3' | 'FileText';
    iconColor: string;
    bgColor: string;
    borderColor: string;
    directUrl: string;
  }> = [
    {
      title: 'Add Products',
      description: 'Place orders to restock inventory',
      icon: 'Package',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200',
      directUrl: 'dashboard/inventory/order'
    },
    {
      title: 'Revenue Report',
      description: 'Track revenue and sales performance',
      icon: 'BarChart3',
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
      borderColor: 'border-emerald-200',
      directUrl: 'dashboard/sales-report'
    },
    {
      title: 'Invoice Scanner',
      description: 'Get data from your invoice',
      icon: 'FileText',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200',
      directUrl: 'dashboard/invoice_scanner'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600 text-lg">{date}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
        </div>
      </div>

      {/* Business Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {businessMetrics.map((metric, index) => (
          <div
            key={index}
            className={`${metric.bgColor} ${metric.borderColor} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{metric.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */} 
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickAction action={action} key={index}/>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Low Stock Products</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Requires Attention</span>
              </div>
            </div>
            <ProductListTable products={products} type='low-stock' />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            
            {/* Activity Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button className="flex-1 py-2 px-3 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm">
                All
              </button>
              <button className="flex-1 py-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-700">
                Restock
              </button>
              <button className="flex-1 py-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-700">
                Sales
              </button>
            </div>

            {/* Activity Items */}
            <div className="space-y-4">
              {[
                { type: 'restock', message: 'Product "Premium Coffee Beans" restocked', time: '2 hours ago', color: 'text-blue-600' },
                { type: 'sale', message: 'Sale completed - $45.99', time: '4 hours ago', color: 'text-green-600' },
                { type: 'alert', message: 'Low stock alert for "Organic Tea"', time: '6 hours ago', color: 'text-orange-600' },
                { type: 'sale', message: 'Bulk order processed - $299.99', time: '8 hours ago', color: 'text-green-600' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'restock' ? 'bg-blue-500' :
                    activity.type === 'sale' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${activity.color}`}>{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <button className="w-full mt-6 py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;