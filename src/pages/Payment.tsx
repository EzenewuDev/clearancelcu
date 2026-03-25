import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  Lock,
  CheckCircle,
  Building2,
  Wallet,
  Smartphone,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { clearanceFees } from '@/data/departments';
import type { ClearanceStatus } from '@/types';

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: 'card' | 'bank' | 'mobile';
}

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card'
  });

  const [reference] = useState(() => `LCU${Date.now()}`);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = v.match(/.{1,4}/g) || [];
    return parts.join(' ').substring(0, 19);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Professional validation
    if (formData.paymentMethod === 'card') {
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Invalid card number. Must be 16 digits.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        setError('Invalid expiry date format. Use MM/YY.');
        return;
      }
      if (formData.cvv.length < 3) {
        setError('Invalid CVV.');
        return;
      }
      if (!formData.cardName.trim()) {
        setError('Cardholder name is required.');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      const payment = {
        id: Date.now().toString(),
        studentId: user?.id,
        amount: clearanceFees.self.baseAmount,
        vat: clearanceFees.self.vat,
        total: clearanceFees.self.total,
        type: 'self',
        status: 'completed',
        reference: reference,
        paidAt: new Date()
      };

      const payments = JSON.parse(localStorage.getItem('lcu_payments') || '[]');
      payments.push(payment);
      localStorage.setItem('lcu_payments', JSON.stringify(payments));

      // Update clearance status for Bursary
      const clearances = JSON.parse(localStorage.getItem('lcu_clearances') || '[]');
      const updatedClearances = clearances.map((c: ClearanceStatus) => {
        if (c.studentId === user?.id) {
          return {
            ...c,
            bursary: { 
              status: 'approved', 
              clearedAt: new Date(), 
              clearedBy: 'System Auto-Approval' 
            },
            updatedAt: new Date()
          };
        }
        return c;
      });
      localStorage.setItem('lcu_clearances', JSON.stringify(updatedClearances));

      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your clearance fee of ₦{clearanceFees.self.total.toLocaleString()} has been paid successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Transaction Reference</p>
              <p className="text-lg font-mono font-semibold">{reference}</p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Payment</h1>
          </div>
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline-block">LCU</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Payment Details</CardTitle>
                <CardDescription>Complete your clearance fee payment</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <RadioGroup 
                    defaultValue="card" 
                    className="grid grid-cols-3 gap-4"
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentFormData['paymentMethod'] }))}
                  >
                    <div>
                      <RadioGroupItem value="card" id="card" className="peer sr-only" />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        Card
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                      <Label
                        htmlFor="bank"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                      >
                        <Building2 className="mb-3 h-6 w-6" />
                        Bank
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="mobile" id="mobile" className="peer sr-only" />
                      <Label
                        htmlFor="mobile"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                      >
                        <Smartphone className="mb-3 h-6 w-6" />
                        Mobile
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              cardNumber: formatCardNumber(e.target.value) 
                            }))}
                            className="pl-10"
                            maxLength={19}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="Name on card"
                          value={formData.cardName}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                              className="pl-9"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'bank' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">Bank Transfer Details</p>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Bank Name:</span> First Bank of Nigeria</p>
                        <p><span className="text-gray-500">Account Name:</span> Lead City University</p>
                        <p><span className="text-gray-500">Account Number:</span> 2034567890</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Use your matric number as reference: {user?.matricNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'mobile' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">Mobile Money / USSD</p>
                      <div className="space-y-2 text-sm">
                        <p>Dial <strong>*565*6*2075#</strong> to pay</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Or use your bank mobile app to transfer to Lead City University
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₦${clearanceFees.self.total.toLocaleString()}`}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-0 shadow-md sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Clearance Fee</span>
                  <span className="font-medium">₦{clearanceFees.self.baseAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">VAT (7.5%)</span>
                  <span className="font-medium">₦{clearanceFees.self.vat.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₦{clearanceFees.self.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Payment Info</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    This payment covers your final year clearance processing fee including VAT.
                  </p>
                </div>

                <div className="mt-4">
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Secure Payment
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
