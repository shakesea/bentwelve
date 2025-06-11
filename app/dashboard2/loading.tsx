import React from 'react';

export default function Dashboard2Loading() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        {/* Profile Skeleton */}
        <div className="flex justify-end mb-6">
          <div className="w-48 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Title Skeleton */}
        <div className="h-8 w-64 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-20 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-[250px] bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Transactions Skeleton */}
          <div className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Selling Products Skeleton */}
          <div className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="h-12 w-12 bg-gray-300 rounded-lg mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}