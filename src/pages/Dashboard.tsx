import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  GraduationCap, 
  LogOut, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen,
  Building2,
  Users,
  Library,
  Wallet,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { ClearanceStatus, ClearanceItem, Student } from '@/types';
import { clearanceFees } from '@/data/departments';

const clearanceItems = [
  { key: 'library', label: 'Library Clearance', icon: Library, description: 'Return all borrowed books' },
  { key: 'bursary', label: 'Bursary Clearance', icon: Wallet, description: 'Pay all outstanding fees' },
  { key: 'studentAffairs', label: 'Student Affairs', icon: Users, description: 'Student ID return' },
  { key: 'department', label: 'Department Clearance', icon: BookOpen, description: 'Departmental requirements' },
  { key: 'faculty', label: 'Faculty Clearance', icon: Building2, description: 'Faculty approval' },
  { key: 'alumni', label: 'Alumni Registration', icon: GraduationCap, description: 'Join alumni network' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [clearance, setClearance] = useState<ClearanceStatus | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'not_paid'>('not_paid');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const loadClearance = () => {
      const clearances = JSON.parse(localStorage.getItem('lcu_clearances') || '[]');
      const userClearance = clearances.find((c: ClearanceStatus) => c.studentId === user?.id);
      if (userClearance) {
        setClearance(userClearance);
      }

      const payments = JSON.parse(localStorage.getItem('lcu_payments') || '[]');
      const userPayment = payments.find((p: { studentId: string; status: string }) => p.studentId === user?.id && p.status === 'completed');
      setPaymentStatus(userPayment ? 'paid' : 'not_paid');
    };

    loadClearance();
  }, [isAuthenticated, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getClearanceItemStatus = (key: string): ClearanceItem => {
    if (!clearance) return { status: 'not_started' };
    
    // Valid clearance item keys
    const validKeys = ['library', 'bursary', 'studentAffairs', 'department', 'faculty', 'alumni'];
    if (!validKeys.includes(key)) return { status: 'not_started' };

    const item = clearance[key as keyof ClearanceStatus];
    if (typeof item === 'object' && item !== null && 'status' in item) {
      return item as ClearanceItem;
    }
    return { status: 'not_started' };
  };

  const calculateProgress = () => {
    if (!clearance) return 0;
    const items = ['library', 'bursary', 'studentAffairs', 'department', 'faculty', 'alumni'];
    const completed = items.filter(key => {
      const item = getClearanceItemStatus(key);
      return item.status === 'approved';
    }).length;
    return Math.round((completed / items.length) * 100);
  };

  const getInitials = (student: Student) => {
    return `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
  };

  if (!user) return null;

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Lead City University</h1>
                <p className="text-xs text-gray-500">Final Year Clearance</p>
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.matricNumber}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your final year clearance process
          </p>
        </div>

        {/* Student Info Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-blue-100 text-sm">Matriculation Number</p>
                <p className="text-lg font-semibold">{user.matricNumber}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Department</p>
                <p className="text-lg font-semibold">{user.department}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Faculty</p>
                <p className="text-lg font-semibold">{user.faculty}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Year of Admission</p>
                <p className="text-lg font-semibold">{user.yearOfAdmission}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Clearance Progress</CardTitle>
            <CardDescription>Track your clearance completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-blue-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-gray-500">
                {progress === 100 
                  ? 'Congratulations! All clearances completed.' 
                  : 'Complete all clearance requirements to graduate.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentStatus === 'paid' ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-green-800">Payment Completed</p>
                  <p className="text-sm text-green-600">Your clearance fee has been paid</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-yellow-800">Payment Required</p>
                    <p className="text-sm text-yellow-600">Clearance Fee: ₦{clearanceFees.self.total.toLocaleString()}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/payment')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Pay Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clearance Items Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clearance Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clearanceItems.map((item) => {
              const clearanceItem = getClearanceItemStatus(item.key);
              const status = clearanceItem.status;
              const Icon = item.icon;
              return (
                <Card key={item.key} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.label}</h4>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                      {getStatusIcon(status as string)}
                    </div>
                    <div className="mt-4">
                      {getStatusBadge(status as string)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Third Party Option */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Need Help with Clearance?</h3>
                <p className="text-gray-600 mt-1">
                  Use our verified third-party agents to handle your clearance process
                </p>
              </div>
              <Button 
                onClick={() => navigate('/third-party')}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Agents
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
