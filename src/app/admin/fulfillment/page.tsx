'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react';

interface PrintOrder {
  sessionId: string;
  orderId: string;
  customerEmail: string;
  created: string;
  amount: number;
  petName: string;
  style: string;
  fileName: string;
  fileExists: boolean;
  filePath: string;
  shipping: {
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
  fulfillmentStatus?: 'pending' | 'uploaded' | 'printed' | 'shipped' | 'delivered';
  gelatoOrderId?: string;
  trackingNumber?: string;
  notes?: string;
}

export default function FulfillmentPage() {
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminAuth');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token and fetch print orders
    fetch('/api/admin/auth', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (res.ok) {
        setAuthenticated(true);
        // Fetch only print orders
        return fetch('/api/admin/fulfillment', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
        throw new Error('Unauthorized');
      }
    })
    .then(res => res?.json())
    .then(data => {
      if (data) {
        setPrintOrders(data.printOrders || []);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch print orders:', err);
      setLoading(false);
    });
  }, [router]);

  const updateFulfillmentStatus = async (sessionId: string, status: string, additionalData: any = {}) => {
    setUpdatingOrder(sessionId);
    try {
      const token = localStorage.getItem('adminAuth');
      const response = await fetch('/api/admin/fulfillment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          sessionId, 
          status,
          ...additionalData
        })
      });
      
      if (response.ok) {
        // Refresh orders
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Fel: ${error.message}`);
      }
    } catch (error) {
      alert(`Fel vid uppdatering: ${error}`);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'printed': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'uploaded': return <ExternalLink className="w-4 h-4" />;
      case 'printed': return <AlertTriangle className="w-4 h-4" />;
      case 'shipped': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar print-beställningar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/dashboard">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till Dashboard
          </button>
        </Link>
        <h1 className="text-2xl font-bold">🖨️ Print Fulfillment</h1>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {['pending', 'uploaded', 'printed', 'shipped', 'delivered'].map(status => {
          const count = printOrders.filter(order => (order.fulfillmentStatus || 'pending') === status).length;
          return (
            <div key={status} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(status)}
                <span className="font-medium capitalize">{status}</span>
              </div>
              <div className="text-2xl font-bold">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Fulfillment Workflow Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-blue-800 mb-4">📋 Print Fulfillment Workflow</h2>
        <div className="grid md:grid-cols-5 gap-4 text-sm">
          <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
            <div className="font-semibold text-yellow-800">1. PENDING</div>
            <p className="text-gray-600">Ny beställning mottagen</p>
            <div className="mt-2 text-xs">
              • Kontrollera fil finns<br/>
              • Verifiera leveransadress
            </div>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-blue-400">
            <div className="font-semibold text-blue-800">2. UPLOADED</div>
            <p className="text-gray-600">Fil uppladdad till Gelato</p>
            <div className="mt-2 text-xs">
              • Använd Gelato dashboard<br/>
              • Ange kundadress<br/>
              • Notera Gelato order ID
            </div>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-purple-400">
            <div className="font-semibold text-purple-800">3. PRINTED</div>
            <p className="text-gray-600">Poster tryckt av Gelato</p>
            <div className="mt-2 text-xs">
              • Gelato bekräftar print<br/>
              • Väntar på frakt
            </div>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-green-400">
            <div className="font-semibold text-green-800">4. SHIPPED</div>
            <p className="text-gray-600">Skickad till kund</p>
            <div className="mt-2 text-xs">
              • Lägg till tracking number<br/>
              • Skicka email till kund (manual)
            </div>
          </div>
          <div className="bg-white p-3 rounded border-l-4 border-gray-400">
            <div className="font-semibold text-gray-800">5. DELIVERED</div>
            <p className="text-gray-600">Levererad till kund</p>
            <div className="mt-2 text-xs">
              • Uppdatera när bekräftat<br/>
              • Beställning klar
            </div>
          </div>
        </div>
      </div>

      {/* Print Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kund</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poster</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leveransadress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {printOrders.map((order) => (
                <tr key={order.sessionId} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">#{order.orderId?.slice(-8)}</div>
                      <div className="text-gray-500">{new Date(order.created).toLocaleDateString('sv-SE')}</div>
                      <div className="text-gray-500">{order.amount / 100} kr</div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{order.customerEmail}</div>
                      {order.shipping && (
                        <div className="text-gray-500">{order.shipping.name}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{order.petName}</div>
                      <div className="text-gray-500">{order.style}</div>
                      {order.fileExists && (
                        <a 
                          href={`/api/download/${order.sessionId}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-1"
                        >
                          <Download className="w-3 h-3" />
                          Ladda ner fil
                        </a>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    {order.shipping ? (
                      <div className="text-sm text-gray-900">
                        <div>{order.shipping.address.line1}</div>
                        {order.shipping.address.line2 && <div>{order.shipping.address.line2}</div>}
                        <div>{order.shipping.address.postal_code} {order.shipping.address.city}</div>
                        <div className="text-gray-500">{order.shipping.address.country}</div>
                        <div className="text-gray-500 mt-1">📞 {order.shipping.phone}</div>
                      </div>
                    ) : (
                      <span className="text-red-600 text-sm">⚠️ Ingen adress</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.fulfillmentStatus || 'pending')}`}>
                        {getStatusIcon(order.fulfillmentStatus || 'pending')}
                        {order.fulfillmentStatus || 'pending'}
                      </span>
                    </div>
                    {order.gelatoOrderId && (
                      <div className="text-xs text-gray-500 mt-1">
                        Gelato: {order.gelatoOrderId}
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        Tracking: {order.trackingNumber}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      {(order.fulfillmentStatus || 'pending') === 'pending' && (
                        <button
                          onClick={() => {
                            const gelatoOrderId = prompt('Ange Gelato Order ID:');
                            if (gelatoOrderId) {
                              updateFulfillmentStatus(order.sessionId, 'uploaded', { gelatoOrderId });
                            }
                          }}
                          disabled={updatingOrder === order.sessionId}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                          Markera uppladdad
                        </button>
                      )}
                      
                      {order.fulfillmentStatus === 'uploaded' && (
                        <button
                          onClick={() => updateFulfillmentStatus(order.sessionId, 'printed')}
                          disabled={updatingOrder === order.sessionId}
                          className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 disabled:opacity-50"
                        >
                          Markera tryckt
                        </button>
                      )}
                      
                      {order.fulfillmentStatus === 'printed' && (
                        <button
                          onClick={() => {
                            const trackingNumber = prompt('Ange tracking number:');
                            if (trackingNumber) {
                              updateFulfillmentStatus(order.sessionId, 'shipped', { trackingNumber });
                            }
                          }}
                          disabled={updatingOrder === order.sessionId}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          Markera skickad
                        </button>
                      )}
                      
                      {order.fulfillmentStatus === 'shipped' && (
                        <button
                          onClick={() => updateFulfillmentStatus(order.sessionId, 'delivered')}
                          disabled={updatingOrder === order.sessionId}
                          className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:opacity-50"
                        >
                          Markera levererad
                        </button>
                      )}

                      <a
                        href="https://gelato.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Gelato
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {printOrders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-medium mb-2">Inga print-beställningar</h3>
          <p>Print-beställningar visas här när kunder väljer fysisk leverans.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-bold text-orange-800 mb-3">🚀 Snabblänkar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://gelato.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-white rounded border hover:shadow-md transition-shadow"
          >
            <ExternalLink className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium">Gelato Dashboard</div>
              <div className="text-sm text-gray-600">Ladda upp filer & hantera orders</div>
            </div>
          </a>
          
          <Link href="/admin/dashboard">
            <div className="flex items-center gap-2 p-3 bg-white rounded border hover:shadow-md transition-shadow cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium">Admin Dashboard</div>
                <div className="text-sm text-gray-600">Alla beställningar & översikt</div>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 p-3 bg-white rounded border">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium">Print-kvalitet</div>
              <div className="text-sm text-gray-600">30x45cm Premium Matt, 200gsm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
