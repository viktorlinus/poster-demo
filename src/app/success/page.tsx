'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { businessEvents } from '@/lib/analytics';

interface OrderDetails {
  orderId: string;
  tier: string;
  amount: number;
  customerEmail?: string;
  petName?: string;
  style?: string;
  success?: boolean;
}

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p>Laddar beställningsinformation...</p>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Confirm payment and move file
      const confirmPayment = async () => {
        try {
          // First confirm payment and move file
          const confirmRes = await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          const confirmData = await confirmRes.json();
          
          if (confirmData.success) {
            console.log('✅ Payment confirmed and file moved!');
            console.log('Order details:', confirmData);
          }
          
          // Then fetch order details for display
          const res = await fetch(`/api/order-details?session_id=${sessionId}`);
          const data = await res.json();
          setOrderDetails(data);
          
          // Track successful order completion
          if (data && data.orderId) {
            businessEvents.orderCompleted(
              data.orderId,
              data.tier === 'digital' ? 'Digital' : 'Print',
              data.amount,
              data.style || 'watercolor'
            );
          }
          
        } catch (error) {
          console.error('Error confirming payment:', error);
        } finally {
          setLoading(false);
        }
      };
      
      confirmPayment();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Bekräftar din beställning...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          Tack för din beställning!
        </h1>
        <p className="text-green-700 mb-6">
          Din AI-poster är beställd och betalning har gått igenom.
        </p>

        {orderDetails && (
          <div className="bg-white rounded-lg p-4 text-left mb-4">
            <h3 className="font-bold mb-2">Orderdetaljer:</h3>
            <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
            <p><strong>Typ:</strong> {orderDetails.tier}</p>
            <p><strong>Pris:</strong> {orderDetails.amount / 100} kr</p>
            {orderDetails.petName && <p><strong>Husdjur:</strong> {orderDetails.petName}</p>}
            {orderDetails.style && <p><strong>Stil:</strong> {orderDetails.style}</p>}
          </div>
        )}

        {/* Digital Download Section */}
        {orderDetails && (orderDetails.tier === 'digital' || orderDetails.tier === 'print') && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-green-800 mb-3">💾 Din digitala fil är redo!</h3>
            <p className="text-green-700 text-sm mb-3">
              Klicka nedan för att ladda ner din högupplösta AI-poster:
            </p>
            <a
              href={`/api/download/${sessionId}`}
              download
              className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium text-center transition-colors"
            >
              📁 Ladda ner din poster (hög kvalitet)
            </a>
            <p className="text-xs text-green-600 mt-2">
              Tips: Högerklicka → &quot;Spara som&quot; för att välja var filen sparas
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">Vad händer nu?</h3>
            <div className="text-blue-700 text-sm space-y-2">
              {orderDetails?.tier === 'digital' ? (
                <>
                  <p>📁 <strong>Digital fil:</strong> Ladda ner direkt ovan - högupplöst och redo för utskrift</p>
                  <p>📞 <strong>Support:</strong> Kontakta oss om du har frågor</p>
                </>
              ) : orderDetails?.tier === 'print' ? (
                <>
                  <p>📁 <strong>Digital fil:</strong> Ladda ner direkt ovan</p>
                  <p>🖨️ <strong>Print version:</strong> Leverans 2-4 arbetsdagar via Gelato</p>
                  <p>📞 <strong>Support:</strong> Kontakta oss om du har frågor</p>
                </>
              ) : (
                <>
                  <p>📧 <strong>Digital version:</strong> Du får ett email med download-länk inom 24h</p>
                  <p>🖨️ <strong>Print version:</strong> Leverans 2-4 arbetsdagar via Gelato</p>
                  <p>📞 <strong>Support:</strong> Kontakta oss om du har frågor</p>
                </>
              )}
            </div>
          </div>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 font-medium"
          >
            🏠 Skapa en ny poster
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
