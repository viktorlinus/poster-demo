'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderData {
  sessionId: string;
  paymentStatus: string;
  amount: number;
  customerEmail: string;
  created: string;
  orderId: string;
  tier: string;
  petName: string;
  style: string;
  fileName: string;
  fileExists: boolean;
  filePath: string;
  fileLocation: 'paid' | 'temp';
  productName: string;
  debugShipping?: {
    hasShipping: boolean;
    hasShippingAddress: boolean;
    hasCustomerDetails: boolean;
    hasCustomerAddress: boolean;
    shippingKeys: string[];
  };
  shipping?: {
    name: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminAuth');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token
    fetch('/api/admin/auth', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (res.ok) {
        setAuthenticated(true);
        // Fetch orders
        return fetch('/api/admin');
      } else {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
        throw new Error('Unauthorized');
      }
    })
    .then(res => res?.json())
    .then(data => {
      if (data) {
        console.log('🔍 Admin data with enhanced debug info:', data);
        setOrders(data.orders || []);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch orders:', err);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const moveFileFromTempToPaid = async (orderId: string, tempPath: string, sessionId: string) => {
    try {
      const token = localStorage.getItem('adminAuth');
      const response = await fetch('/api/admin/move-file', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, tempPath, sessionId })
      });
      
      if (response.ok) {
        alert('Fil flyttad framgångsrikt!');
        window.location.reload(); // Refresh to show updated status
      } else {
        const error = await response.json();
        alert(`Fel: ${error.message}`);
      }
    } catch (error) {
      alert(`Fel vid flytt: ${error}`);
    }
  };

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{authenticated ? 'Laddar beställningar...' : 'Kontrollerar behörighet...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛠️ Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/dev">
            <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
              🧪 Development Tools
            </button>
          </Link>
          <button 
            onClick={() => setDebugMode(!debugMode)}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            {debugMode ? 'Dölj' : 'Visa'} Debug Info
          </button>
          <button 
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            🚪 Logga ut
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="font-bold text-blue-800">Totalt: {orders.length} beställningar</h2>
        <p className="text-blue-700">Senaste 7 dagarna</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Datum</th>
              <th className="border border-gray-300 p-2 text-left">Kund</th>
              <th className="border border-gray-300 p-2 text-left">Husdjur</th>
              <th className="border border-gray-300 p-2 text-left">Stil</th>
              <th className="border border-gray-300 p-2 text-left">Typ</th>
              <th className="border border-gray-300 p-2 text-left">Pris</th>
              <th className="border border-gray-300 p-2 text-left">Leverans</th>
              <th className="border border-gray-300 p-2 text-left">Fil</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.sessionId} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  {new Date(order.created).toLocaleDateString('sv-SE')}
                  <br />
                  <span className="text-xs text-gray-500">
                    {new Date(order.created).toLocaleTimeString('sv-SE')}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  {order.customerEmail}
                  <br />
                  <span className="text-xs text-gray-500">
                    ID: {order.orderId?.slice(-8)}
                  </span>
                </td>
                <td className="border border-gray-300 p-2 font-medium">
                  {order.petName || 'Okänt'}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.style || 'watercolor'}
                </td>
                <td className="border border-gray-300 p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.tier === 'digital' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.tier}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  {order.amount ? `${order.amount / 100} kr` : '-'}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.tier === 'print' ? (
                    order.shipping ? (
                      <div className="text-xs">
                        <div className="font-medium">{order.shipping.name}</div>
                        <div>{order.shipping.address.line1}</div>
                        {order.shipping.address.line2 && <div>{order.shipping.address.line2}</div>}
                        <div>{order.shipping.address.postal_code} {order.shipping.address.city}</div>
                        <div className="text-gray-500">{order.shipping.phone}</div>
                        <div className="text-xs text-gray-400 mt-1">{order.shipping.address.country}</div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-red-600 text-xs">⚠️ Ingen leveransadress hittad</span>
                        {debugMode && order.debugShipping && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                            <div>Shipping: {order.debugShipping.hasShipping ? '✅' : '❌'}</div>
                            <div>Shipping Address: {order.debugShipping.hasShippingAddress ? '✅' : '❌'}</div>
                            <div>Customer Details: {order.debugShipping.hasCustomerDetails ? '✅' : '❌'}</div>
                            <div>Customer Address: {order.debugShipping.hasCustomerAddress ? '✅' : '❌'}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Shipping keys: {JSON.stringify(order.debugShipping.shippingKeys)}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <span className="text-gray-400 text-xs">Digital - ingen leverans</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.fileExists ? (
                    <div>
                      <span className="text-green-600 text-xs">
                        ✅ {order.fileName || order.filePath?.split('/').pop()}
                      </span>
                      <div className="text-xs mt-1">
                        <span className={`px-1 py-0.5 rounded ${
                          order.fileLocation === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.fileLocation === 'paid' ? 'Betald' : 'Temporär'}
                        </span>
                      </div>
                      {order.fileLocation === 'temp' && order.paymentStatus === 'paid' && (
                        <button
                          onClick={() => moveFileFromTempToPaid(order.orderId, order.filePath, order.sessionId)}
                          className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          Flytta till betald
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-red-600 text-xs">
                      ❌ Fil saknas
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Inga beställningar hittades
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">💡 Hur du hanterar beställningar:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-green-700">✅ Digital Orders (79kr):</h4>
            <ul className="space-y-1 ml-4">
              <li>• Automatisk leverans (planerad)</li>
              <li>• Fil finns i <code>paid_orders/</code></li>
              <li>• Inga ytterligare åtgärder behövs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700">🖨️ Print Orders (299kr):</h4>
            <ul className="space-y-1 ml-4">
              <li>• Kräver leveransadress</li>
              <li>• Ladda upp fil till Gelato</li>
              <li>• Använd kundadress för leverans</li>
              <li>• Gelato hanterar frakt + tracking</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <h4 className="font-semibold text-orange-700">🔧 Felsökning:</h4>
          <ul className="text-sm space-y-1 ml-4">
            <li>• <strong>Fil i &quot;Temporär&quot;:</strong> Webhook misslyckades - använd &quot;Flytta till betald&quot; knappen</li>
            <li>• <strong>Ingen leveransadress:</strong> Kolla debug-info eller kontakta kunden direkt</li>
            <li>• <strong>Fil saknas:</strong> Kontrollera R2 bucket manuellt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
