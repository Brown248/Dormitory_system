'use client';
import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers).catch(console.error);
  }, []);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Customers & Tenants</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.length === 0 ? (
          <p className="text-gray-500">No customers found.</p>
        ) : (
          customers.map((customer: any) => (
            <div key={customer.id} className="p-6 bg-white shadow rounded-lg border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{customer.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{customer.phone || 'No phone number'}</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">LINE ID: {customer.line_user_id ? 'Linked' : 'Not Linked'}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">Unit: {customer.unit_id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
