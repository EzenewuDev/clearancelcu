import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Star, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Shield,
  Search,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';
import { thirdPartyAgents, clearanceFees } from '@/data/departments';
import { useAuth } from '@/hooks/useAuth';
import type { ClearanceStatus } from '@/types';

export default function ThirdParty() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<typeof thirdPartyAgents[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [reference] = useState(() => `LCU-TP${Date.now()}`);

  const filteredAgents = thirdPartyAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAgent = (agent: typeof thirdPartyAgents[0]) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    setSelectedAgent(agent);
    setIsDialogOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedAgent || !user) return;
    
    setError('');
    setIsProcessing(true);

    setTimeout(() => {
      const payment = {
        id: Date.now().toString(),
        studentId: user.id,
        amount: clearanceFees.self.baseAmount,
        vat: clearanceFees.self.vat,
        thirdPartyFee: selectedAgent.fee,
        total: clearanceFees.self.baseAmount + clearanceFees.self.vat + selectedAgent.fee,
        type: 'third_party',
        agentId: selectedAgent.id,
        status: 'completed',
        reference: reference,
        paidAt: new Date()
      };

      const payments = JSON.parse(localStorage.getItem('lcu_payments') || '[]');
      payments.push(payment);
      localStorage.setItem('lcu_payments', JSON.stringify(payments));

      // Update clearance status
      const clearances = JSON.parse(localStorage.getItem('lcu_clearances') || '[]');
      const updatedClearances = clearances.map((c: ClearanceStatus) => {
        if (c.studentId === user.id) {
          return {
            ...c,
            overallStatus: 'in_progress',
            updatedAt: new Date(),
            // All items marked as pending because the agent is now handling them
            library: c.library.status === 'approved' ? c.library : { status: 'pending', comment: `Agent: ${selectedAgent.name} handling...` },
            bursary: c.bursary.status === 'approved' ? c.bursary : { status: 'pending', comment: `Agent: ${selectedAgent.name} handling...` },
            studentAffairs: c.studentAffairs.status === 'approved' ? c.studentAffairs : { status: 'pending', comment: `Agent: ${selectedAgent.name} handling...` },
            department: c.department.status === 'approved' ? c.department : { status: 'pending', comment: `Agent: ${selectedAgent.name} handling...` },
            faculty: c.faculty.status === 'approved' ? c.faculty : { status: 'pending', comment: `Agent: ${selectedAgent.name} handling...` },
            alumni: c.alumni.status === 'approved' ? c.alumni : { status: 'pending', comment: `Agent: ${selectedAgent.name} handling...` },
          };
        }
        return c;
      });
      localStorage.setItem('lcu_clearances', JSON.stringify(updatedClearances));

      setIsProcessing(false);
      setIsDialogOpen(false);
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Your third-party clearance request has been submitted successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Agent</p>
              <p className="font-semibold">{selectedAgent?.name}</p>
              <p className="text-sm text-gray-500 mt-2">Reference</p>
              <p className="font-mono font-semibold">{reference}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              The agent will contact you within 24 hours to begin the clearance process.
            </p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
                className="mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Third-Party Clearance</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 hidden sm:inline-block">LCU</span>
              </Link>
              {!isAuthenticated && (
                <Button 
                  onClick={() => navigate('/signup')}
                  variant="outline"
                >
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Professional Clearance Assistance
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Let our verified third-party agents handle your clearance process. 
            They'll take care of all the paperwork and department visits for you.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Agents</h3>
              <p className="text-sm text-gray-600">All agents are vetted and approved by Lead City University</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600">Get your clearance completed in record time</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-purple-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">Professional assistance throughout the process</p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Comparison */}
        <Card className="mb-10 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Pricing Comparison</CardTitle>
            <CardDescription>Compare self-service vs third-party clearance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Self-Service</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clearance Fee</span>
                    <span>₦{clearanceFees.self.baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT</span>
                    <span>₦{clearanceFees.self.vat.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">₦{clearanceFees.self.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-900">Third-Party Service</h4>
                  <Badge className="bg-purple-100 text-purple-800">Recommended</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clearance Fee</span>
                    <span>₦{clearanceFees.self.baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT</span>
                    <span>₦{clearanceFees.self.vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee (from)</span>
                    <span>₦{Math.min(...thirdPartyAgents.map(a => a.fee)).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total (from)</span>
                    <span className="text-purple-600">₦{(clearanceFees.self.total + Math.min(...thirdPartyAgents.map(a => a.fee))).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {agent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{agent.rating}</span>
                        <span className="text-sm text-gray-500">({agent.completedClearances}+)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{agent.phone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Service Fee</p>
                  <p className="text-lg font-bold text-purple-600">₦{agent.fee.toLocaleString()}</p>
                </div>
                <Button 
                  onClick={() => handleSelectAgent(agent)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Select
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No agents found matching your search.</p>
          </div>
        )}
      </main>

      {/* Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Third-Party Service</DialogTitle>
            <DialogDescription>
              Review the details before proceeding with payment
            </DialogDescription>
          </DialogHeader>

          {selectedAgent && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Selected Agent</p>
                <p className="font-semibold">{selectedAgent.name}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Clearance Fee</span>
                  <span>₦{clearanceFees.self.baseAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT</span>
                  <span>₦{clearanceFees.self.vat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span>₦{selectedAgent.fee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-purple-600">
                    ₦{(clearanceFees.self.total + selectedAgent.fee).toLocaleString()}
                  </span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
