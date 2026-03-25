import type { Department, ThirdPartyAgent } from '@/types';

export const departments: Department[] = [
  { id: '1', name: 'Computer Science', faculty: 'Science and Technology', code: 'CSC' },
  { id: '2', name: 'Software Engineering', faculty: 'Science and Technology', code: 'SEN' },
  { id: '3', name: 'Information Technology', faculty: 'Science and Technology', code: 'IFT' },
  { id: '4', name: 'Cyber Security', faculty: 'Science and Technology', code: 'CYB' },
  { id: '5', name: 'Data Science', faculty: 'Science and Technology', code: 'DSC' },
  { id: '6', name: 'Accounting', faculty: 'Management and Social Sciences', code: 'ACC' },
  { id: '7', name: 'Business Administration', faculty: 'Management and Social Sciences', code: 'BUA' },
  { id: '8', name: 'Economics', faculty: 'Management and Social Sciences', code: 'ECO' },
  { id: '9', name: 'Marketing', faculty: 'Management and Social Sciences', code: 'MKT' },
  { id: '10', name: 'Banking and Finance', faculty: 'Management and Social Sciences', code: 'BNF' },
  { id: '11', name: 'Entrepreneurship', faculty: 'Management and Social Sciences', code: 'ENT' },
  { id: '12', name: 'Human Resource Management', faculty: 'Management and Social Sciences', code: 'HRM' },
  { id: '13', name: 'International Relations', faculty: 'Arts and Humanities', code: 'INR' },
  { id: '14', name: 'Mass Communication', faculty: 'Arts and Humanities', code: 'MAC' },
  { id: '15', name: 'English Language', faculty: 'Arts and Humanities', code: 'ENG' },
  { id: '16', name: 'History and International Studies', faculty: 'Arts and Humanities', code: 'HIS' },
  { id: '17', name: 'Theatre Arts', faculty: 'Arts and Humanities', code: 'THA' },
  { id: '18', name: 'Religious Studies', faculty: 'Arts and Humanities', code: 'REL' },
  { id: '19', name: 'Law', faculty: 'Law', code: 'LAW' },
  { id: '20', name: 'Medicine and Surgery', faculty: 'Health Sciences', code: 'MBBS' },
  { id: '21', name: 'Nursing Science', faculty: 'Health Sciences', code: 'NSC' },
  { id: '22', name: 'Public Health', faculty: 'Health Sciences', code: 'PUH' },
  { id: '23', name: 'Medical Laboratory Science', faculty: 'Health Sciences', code: 'MLS' },
  { id: '24', name: 'Pharmacy', faculty: 'Pharmaceutical Sciences', code: 'PHM' },
  { id: '25', name: 'Architecture', faculty: 'Environmental Sciences', code: 'ARC' },
  { id: '26', name: 'Estate Management', faculty: 'Environmental Sciences', code: 'ESM' },
  { id: '27', name: 'Urban and Regional Planning', faculty: 'Environmental Sciences', code: 'URP' },
  { id: '28', name: 'Quantity Surveying', faculty: 'Environmental Sciences', code: 'QTS' },
  { id: '29', name: 'Biochemistry', faculty: 'Science and Technology', code: 'BCH' },
  { id: '30', name: 'Microbiology', faculty: 'Science and Technology', code: 'MCB' },
];

export const thirdPartyAgents: ThirdPartyAgent[] = [
  {
    id: '1',
    name: 'Clearance Pro Nigeria',
    email: 'contact@clearancepro.ng',
    phone: '+234 801 234 5678',
    rating: 4.8,
    completedClearances: 1250,
    fee: 3500,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent1'
  },
  {
    id: '2',
    name: 'UniClear Services',
    email: 'info@uniclear.ng',
    phone: '+234 802 345 6789',
    rating: 4.6,
    completedClearances: 890,
    fee: 3200,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent2'
  },
  {
    id: '3',
    name: 'Fast Track Clearance',
    email: 'support@fasttrack.ng',
    phone: '+234 803 456 7890',
    rating: 4.9,
    completedClearances: 2100,
    fee: 4000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent3'
  },
  {
    id: '4',
    name: 'EduClear Solutions',
    email: 'hello@educlear.ng',
    phone: '+234 804 567 8901',
    rating: 4.5,
    completedClearances: 650,
    fee: 3000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent4'
  },
  {
    id: '5',
    name: 'Graduate Assist Nigeria',
    email: 'info@graduateassist.ng',
    phone: '+234 805 678 9012',
    rating: 4.7,
    completedClearances: 1580,
    fee: 3800,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent5'
  }
];

export const clearanceFees = {
  self: {
    baseAmount: 2000,
    vat: 75,
    total: 2075
  },
  thirdParty: {
    baseAmount: 2000,
    vat: 75,
    serviceFee: 1500,
    total: 3575
  }
};

export const faculties = [
  'Science and Technology',
  'Management and Social Sciences',
  'Arts and Humanities',
  'Law',
  'Health Sciences',
  'Pharmaceutical Sciences',
  'Environmental Sciences'
];
