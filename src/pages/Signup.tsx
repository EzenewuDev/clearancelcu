import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, GraduationCap, User, Mail, Phone, Lock, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { departments, faculties } from '@/data/departments';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    matricNumber: '',
    email: '',
    phoneNumber: '',
    department: '',
    faculty: '',
    yearOfAdmission: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateMatricNumber = (matric: string): boolean => {
    const pattern = /^LCU\/UG\/(1[8-9]|2[0-5])\/\d{5}$/i;
    return pattern.test(matric);
  };

  const getYearFromMatric = (matric: string): number => {
    const match = matric.match(/LCU\/UG\/(\d{2})\/\d{5}/i);
    if (match) {
      const year = parseInt(match[1]);
      return 2000 + year;
    }
    return 0;
  };

  const handleMatricChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setFormData(prev => ({
      ...prev,
      matricNumber: upperValue,
      yearOfAdmission: getYearFromMatric(upperValue).toString()
    }));
  };

  const handleDepartmentChange = (deptName: string) => {
    const dept = departments.find(d => d.name === deptName);
    if (dept) {
      setFormData(prev => ({
        ...prev,
        department: dept.name,
        faculty: dept.faculty
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Professional validation
    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      setError('First name must be at least 2 characters long');
      return;
    }

    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      setError('Last name must be at least 2 characters long');
      return;
    }

    if (!validateMatricNumber(formData.matricNumber)) {
      setError('Invalid matriculation number format. Use: LCU/UG/18/XXXXX');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^\+?(\d{10,14})$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number (10-14 digits)');
      return;
    }

    if (!formData.department) {
      setError('Please select your department');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter and one number');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        matricNumber: formData.matricNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        faculty: formData.faculty,
        yearOfAdmission: parseInt(formData.yearOfAdmission)
      }, formData.password);

      if (success) {
        navigate('/dashboard');
      } else {
        setError('An account with this matriculation number already exists');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <Link to="/" className="flex justify-center mb-4 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-1">Register for the Final Year Clearance System</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold">Student Registration</CardTitle>
            <CardDescription>
              Fill in your details to create your clearance account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricNumber">Matriculation Number</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="matricNumber"
                    placeholder="LCU/UG/18/XXXXX"
                    value={formData.matricNumber}
                    onChange={(e) => handleMatricChange(e.target.value)}
                    className="pl-9 uppercase"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">Format: LCU/UG/18/XXXXX (Year: 18-25)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+234 XXX XXX XXXX"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={handleDepartmentChange} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {faculties.map(faculty => (
                      <SelectGroup key={faculty}>
                        <SelectLabel className="bg-gray-50 font-bold text-blue-600">
                          {faculty}
                        </SelectLabel>
                        {departments.filter(d => d.faculty === faculty).map(dept => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.faculty && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Faculty</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        value={formData.faculty}
                        readOnly
                        className="pl-9 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Year of Admission</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        value={formData.yearOfAdmission}
                        readOnly
                        className="pl-9 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-9 pr-9"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-9 pr-9"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <div className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Lead City University. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
