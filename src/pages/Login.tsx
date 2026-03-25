import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, GraduationCap, Lock, User, CheckCircle, Quote, Target, Sparkles, BookOpen, Award, Users, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const quotes = [
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Your education is a dress rehearsal for a life that is yours to lead.",
    author: "Nora Ephron"
  }
];

const goals = [
  {
    icon: Target,
    title: "Streamlined Process",
    description: "Complete your clearance in record time with our efficient digital system"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with bank-grade security encryption"
  },
  {
    icon: Users,
    title: "24/7 Support",
    description: "Get assistance anytime from our dedicated support team"
  },
  {
    icon: Award,
    title: "Verified Agents",
    description: "Access to trusted third-party clearance professionals"
  }
];

const features = [
  "Online Payment Integration",
  "Real-time Status Tracking",
  "Document Management",
  "Multi-department Coordination"
];

export default function Login() {
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const validateMatricNumber = (matric: string): boolean => {
    const pattern = /^LCU\/UG\/(1[8-9]|2[0-5])\/\d{5}$/i;
    return pattern.test(matric);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Professional validation
    if (!matricNumber.trim()) {
      setError('Please enter your matriculation number');
      return;
    }

    if (!validateMatricNumber(matricNumber)) {
      setError('Invalid matriculation number format. Use: LCU/UG/18/XXXXX');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(matricNumber, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid matriculation number or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <img 
            src="/images/campus-building.jpg" 
            alt="Lead City University Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Side - Welcome Message */}
            <div className="text-white space-y-6">
              <Link to="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
                <img src="/logo.png" alt="LCU Logo" className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm" />
                <div>
                  <h1 className="text-2xl font-bold">Lead City University</h1>
                  <p className="text-blue-200">Excellence in Education</p>
                </div>
              </Link>
              
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Final Year <span className="text-yellow-400">Clearance</span> Portal
              </h2>
              
              <p className="text-lg text-blue-100 max-w-lg">
                Your gateway to a seamless graduation experience. Complete your clearance 
                requirements efficiently and celebrate your achievement.
              </p>

              {/* Features List */}
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => (
                  <Badge 
                    key={index} 
                    className="bg-white/20 text-white border-0 backdrop-blur-sm px-3 py-1"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right Side - Quote */}
            <div className="hidden lg:block">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-yellow-400 mb-4" />
                  <p className="text-xl italic mb-4 min-h-[80px]">
                    "{quotes[currentQuote].text}"
                  </p>
                  <p className="text-right text-blue-200">
                    — {quotes[currentQuote].author}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/80 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Images & Info */}
          <div className="space-y-8">
            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img 
                  src="/images/graduating-students.jpg" 
                  alt="Graduating Students" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold">Celebrate Success</p>
                  <p className="text-sm text-gray-200">Join thousands of graduates</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img 
                  src="/images/students-studying.jpg" 
                  alt="Students Studying" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold">Academic Excellence</p>
                  <p className="text-sm text-gray-200">Years of dedication</p>
                </div>
              </div>
            </div>

            {/* Goals Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Why Choose Our Platform?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map((goal, index) => {
                  const Icon = goal.icon;
                  return (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">10K+</p>
                    <p className="text-sm text-blue-200">Students Cleared</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">30+</p>
                    <p className="text-sm text-blue-200">Departments</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">99%</p>
                    <p className="text-sm text-blue-200">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardHeader className="space-y-1 pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Sign in with your matriculation number to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="matricNumber" className="text-sm font-medium">
                      Matriculation Number
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="matricNumber"
                        type="text"
                        placeholder="LCU/UG/18/XXXXX"
                        value={matricNumber}
                        onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
                        className="pl-10 h-12 text-base uppercase"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Format: LCU/UG/18/XXXXX (Year: 18-25)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 text-base"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="text-sm text-center text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Create Account
                  </Link>
                </div>
                <div className="text-xs text-center text-gray-500">
                  <Link to="/third-party" className="hover:text-blue-600 flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Use Third-Party Clearance Service
                  </Link>
                </div>
              </CardFooter>
            </Card>

            {/* Quick Help */}
            <Card className="mt-4 border-0 shadow-md bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Need Help?</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Contact the ICT Support Center at{' '}
                      <a href="mailto:support@lcu.edu.ng" className="text-blue-600 hover:underline">
                        support@lcu.edu.ng
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <img src="/logo.png" alt="LCU Logo" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">Lead City University</p>
                <p className="text-sm text-gray-400">Ibadan, Nigeria</p>
              </div>
            </Link>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Lead City University. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Final Year Clearance System v1.0
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
