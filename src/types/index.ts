export interface Student {
  id: string;
  matricNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  faculty: string;
  yearOfAdmission: number;
  phoneNumber: string;
  profilePicture?: string;
}

export interface ClearanceStatus {
  id: string;
  studentId: string;
  library: ClearanceItem;
  bursary: ClearanceItem;
  studentAffairs: ClearanceItem;
  department: ClearanceItem;
  faculty: ClearanceItem;
  alumni: ClearanceItem;
  overallStatus: 'pending' | 'in_progress' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ClearanceItem {
  status: 'pending' | 'approved' | 'rejected' | 'not_started';
  comment?: string;
  clearedBy?: string;
  clearedAt?: Date;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  vat: number;
  total: number;
  type: 'self' | 'third_party';
  thirdPartyFee?: number;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  paidAt?: Date;
}

export interface Department {
  id: string;
  name: string;
  faculty: string;
  code: string;
}

export interface ThirdPartyAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  completedClearances: number;
  fee: number;
  avatar?: string;
}

export type UserRole = 'student' | 'admin' | 'third_party';

export interface AuthState {
  isAuthenticated: boolean;
  user: Student | null;
  role: UserRole;
}
