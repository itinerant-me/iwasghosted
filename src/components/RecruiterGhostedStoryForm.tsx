import { Calendar, Building2, MapPin, Link, MessageSquare, Briefcase, Check, FolderTree, Send, LogIn, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export interface FormData {
  company: string;
  domain: string;
  role: string;
  department: string;
  customDepartment?: string;
  industry: string;
  customIndustry?: string;
  vertical: string;
  customVertical?: string;
  yearsOfExperience: number;
  location: string;
  comments: string;
  roundGhosted: string;
  communicationEndDate: string;
  channels: string[];
  nextStepsPromised: string;
  waitingDays: number;
  processStartDate: string;
  logo: string;
  jobUrl: string;
  candidateSource: 'job_portals' | 'linkedin' | 'job_fair' | 'inbound' | 'internal_reference' | '';
  applicationSource: 'approached' | 'applied' | '';
  isAnonymous?: boolean;
  isVerified?: boolean;
  type?: 'recruiter' | 'candidate';
}

interface RecruiterGhostedStoryFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (isAnonymous: boolean, submissionData: FormData) => void;
  initialData?: FormData;
}

const departments = [
  // Engineering & Technology
  'Software Engineering',
  'Data Science & Analytics',
  'Infrastructure & DevOps',
  'Information Technology',
  'Security & Compliance',
  'Quality Assurance',
  'Technical Architecture',
  
  // Product
  'Product Management',
  'Product Design',
  'User Experience',
  'User Research',
  
  // Business & Operations
  'Sales',
  'Marketing',
  'Business Development',
  'Customer Success',
  'Customer Support',
  'Operations',
  'Project Management',
  'Strategy',
  
  // Corporate Functions
  'Human Resources',
  'Finance',
  'Legal',
  'Administration',
  'Facilities',
  'Corporate Communications',
  
  // Leadership
  'Executive Leadership',
  'General Management',
  
  // Specialized
  'Research & Development',
  'Consulting',
  'Supply Chain',
  'Procurement',
  'Manufacturing',
  'Logistics',
  
  // Others
  'Other (Custom)',
];

const industries = [
  // Technology
  'Software & Internet',
  'IT Services & Consulting',
  'Hardware & Electronics',
  'Telecommunications',
  'Cybersecurity',
  'Cloud Computing',
  
  // Financial Services
  'Banking',
  'Insurance',
  'Investment Banking',
  'Asset Management',
  'FinTech',
  'Venture Capital & Private Equity',
  
  // Healthcare
  'Healthcare Providers',
  'Pharmaceuticals',
  'Medical Devices',
  'Biotechnology',
  'Health Technology',
  
  // Consumer
  'Retail',
  'E-commerce',
  'Consumer Goods',
  'Food & Beverage',
  'Hospitality & Travel',
  'Entertainment & Media',
  
  // Industrial
  'Manufacturing',
  'Automotive',
  'Aerospace & Defense',
  'Construction',
  'Energy & Utilities',
  'Transportation & Logistics',
  
  // Professional Services
  'Management Consulting',
  'Legal Services',
  'Accounting & Auditing',
  'Marketing & Advertising',
  
  // Others
  'Education',
  'Non-profit',
  'Government',
  'Real Estate',
  'Agriculture',
  'Other (Custom)',
];

const verticals = [
  // B2B
  'Enterprise Software',
  'Business Services',
  'Professional Services',
  'Industrial Solutions',
  'B2B Marketplace',
  
  // B2C
  'Consumer Apps',
  'E-commerce Platform',
  'Consumer Services',
  'Social Media',
  'Gaming',
  
  // Financial
  'Payment Solutions',
  'Banking Services',
  'Investment Platforms',
  'Insurance Tech',
  'Cryptocurrency',
  
  // Technology
  'Cloud Infrastructure',
  'AI/ML Solutions',
  'IoT Platforms',
  'Developer Tools',
  'Cybersecurity Solutions',
  
  // Industry-Specific
  'Healthcare Tech',
  'EdTech',
  'PropTech',
  'AgTech',
  'CleanTech',
  
  // Others
  'Marketplace',
  'SaaS',
  'PaaS',
  'IaaS',
  'Other (Custom)',
];

const communicationChannels = ['Email', 'Social Media', 'Phone', 'WhatsApp', 'References'];
const interviewRounds = [
  'Initial Contact',
  'Phone Screen',
  'Technical Interview',
  'Onsite Interview',
  'Final Interview',
  'Offer Stage',
  'Post Offer',
  'In Negotiation'
];

const candidateSourceOptions = [
  { value: 'job_portals', label: 'Job Portals' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'job_fair', label: 'Job Fair' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'internal_reference', label: 'Internal Reference' }
];

export default function RecruiterGhostedStoryForm({ 
  formData, 
  setFormData, 
  onSubmit 
}: RecruiterGhostedStoryFormProps) {
  const navigate = useNavigate();
  const [showCustomDepartment, setShowCustomDepartment] = useState(false);
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [showCustomVertical, setShowCustomVertical] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = (): boolean => {
    const requiredFields = [
      'company', 'domain', 'role', 'department', 'industry', 'vertical',
      'yearsOfExperience', 'location', 'roundGhosted', 'communicationEndDate',
      'channels', 'waitingDays', 'processStartDate', 'candidateSource'
    ] as const;

    return requiredFields.every(field => {
      const value = formData[field];
      return value !== undefined && value !== '' && 
        !(Array.isArray(value) && value.length === 0);
    });
  };

  const handleVerifiedSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      validateForm();
      return;
    }

    setIsSubmitting(true);
    try {
      if (!auth.currentUser) {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
      
      if (auth.currentUser) {
        await onSubmit(false, { ...formData, type: 'recruiter' });
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setFieldErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Authentication failed. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymousSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      validateForm();
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(true, { ...formData, type: 'recruiter' });
    } catch (error) {
      console.error('Submission failed:', error);
      setFieldErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Submission failed. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const getErrorMessage = (field: keyof FormData) => {
    if (fieldErrors[field]) {
      const labels: Partial<Record<keyof FormData, string>> = {
        company: 'Company Name',
        domain: 'Company Domain',
        role: 'Job Role',
        department: 'Department',
        industry: 'Industry',
        vertical: 'Vertical',
        yearsOfExperience: 'Years of Experience',
        location: 'Location',
        comments: 'Comments',
        roundGhosted: 'Round Ghosted',
        communicationEndDate: 'Last Communication Date',
        channels: 'Communication Channels',
        nextStepsPromised: 'Next Steps Promised',
        waitingDays: 'Waiting Days',
        processStartDate: 'Process Start Date',
        logo: 'Company Logo',
        jobUrl: 'Job URL',
        candidateSource: 'Candidate Source',
        applicationSource: 'Application Source',
        isAnonymous: 'Anonymous Submission',
        isVerified: 'Verified Submission',
        type: 'Story Type',
        customDepartment: 'Custom Department',
        customIndustry: 'Custom Industry',
        customVertical: 'Custom Vertical',
      };
      return `${labels[field] || field} is required`;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const requiredFields: (keyof FormData)[] = [
      'company',
      'domain',
      'role',
      'department',
      'industry',
      'vertical',
      'yearsOfExperience',
      'location',
      'roundGhosted',
      'communicationEndDate',
      'processStartDate',
      'candidateSource'
    ];

    requiredFields.forEach(field => {
      const error = getErrorMessage(field);
      if (error) {
        newErrors[field] = error;
      }
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'department') {
      setShowCustomDepartment(value === 'Other (Custom)');
    } else if (name === 'industry') {
      setShowCustomIndustry(value === 'Other (Custom)');
    } else if (name === 'vertical') {
      setShowCustomVertical(value === 'Other (Custom)');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Only clear the error for the current field
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'domain') {
      fetchCompanyLogo(value);
    }
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const submissionData: FormData = {
        ...formData,
        type: 'recruiter',
        isAnonymous: false,
        isVerified: true
      };

      await onSubmit(true, submissionData);
      
      setFieldErrors({});
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  const fetchCompanyLogo = async (domain: string) => {
    if (!domain) return;
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    setFormData(prev => ({ ...prev, logo: logoUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {Object.keys(fieldErrors).length > 0 && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          Please fix the errors below
        </div>
      )}
      {/* Company Section */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Building2 className="w-4 h-4 text-blue-500" />
          Company Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.company ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              placeholder="Enter company name"
              required
            />
            {fieldErrors.company && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('company')}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Company Domain <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.domain ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              placeholder="e.g., company.com"
              required
            />
            {fieldErrors.domain && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('domain')}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Building2 className="w-4 h-4 text-blue-500 inline-block mr-1" />
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.industry ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              required
            >
              <option value="">Select Industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {fieldErrors.industry && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('industry')}
              </div>
            )}
            {showCustomIndustry && (
              <input
                type="text"
                name="customIndustry"
                value={formData.customIndustry}
                onChange={handleInputChange}
                placeholder="Enter custom industry"
                className="mt-2 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <FolderTree className="w-4 h-4 text-blue-500 inline-block mr-1" />
              Business Vertical <span className="text-red-500">*</span>
            </label>
            <select
              name="vertical"
              value={formData.vertical}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.vertical ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              required
            >
              <option value="">Select Vertical</option>
              {verticals.map(vertical => (
                <option key={vertical} value={vertical}>{vertical}</option>
              ))}
            </select>
            {fieldErrors.vertical && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('vertical')}
              </div>
            )}
            {showCustomVertical && (
              <input
                type="text"
                name="customVertical"
                value={formData.customVertical}
                onChange={handleInputChange}
                placeholder="Enter custom vertical"
                className="mt-2 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        </div>
      </div>

      {/* Candidate Source Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Candidate Source</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {candidateSourceOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, candidateSource: value as FormData['candidateSource'] }))}
              className={`px-3 py-2 rounded-lg border text-xs transition-all ${
                formData.candidateSource === value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {fieldErrors.candidateSource && (
          <div className="mt-1 text-xs text-red-500">
            {getErrorMessage('candidateSource')}
          </div>
        )}
      </div>

      {/* Position Details */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <MapPin className="w-4 h-4 text-blue-500" />
          Position Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              placeholder="Job title"
              required
            />
            {fieldErrors.role && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('role')}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              placeholder="City, Country"
              required
            />
            {fieldErrors.location && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('location')}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Briefcase className="w-4 h-4 text-blue-500 inline-block mr-1" />
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.department ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {fieldErrors.department && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('department')}
              </div>
            )}
            {showCustomDepartment && (
              <input
                type="text"
                name="customDepartment"
                value={formData.customDepartment}
                onChange={handleInputChange}
                placeholder="Enter custom department"
                className="mt-2 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              min="0"
              max="50"
              step="0.5"
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.yearsOfExperience ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              required
            />
            {fieldErrors.yearsOfExperience && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('yearsOfExperience')}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Link className="w-4 h-4 text-blue-500" />
            Job URL
          </label>
          <input
            type="url"
            name="jobUrl"
            value={formData.jobUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Interview Process */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          Interview Process
        </h2>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Ghosted After Round <span className="text-red-500">*</span>
          </label>
          <select
            name="roundGhosted"
            value={formData.roundGhosted}
            onChange={handleInputChange}
            className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
              fieldErrors.roundGhosted ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
            } focus:border-transparent appearance-none`}
            required
          >
            <option value="">Select Round</option>
            {interviewRounds.map(round => (
              <option key={round} value={round}>{round}</option>
            ))}
          </select>
          {fieldErrors.roundGhosted && (
            <div className="mt-1 text-xs text-red-500">
              {getErrorMessage('roundGhosted')}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Communication Channels <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {communicationChannels.map(channel => (
              <button
                key={channel}
                type="button"
                onClick={() => handleChannelToggle(channel)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                  ${formData.channels.includes(channel)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {channel}
                {formData.channels.includes(channel) && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
          {fieldErrors.channels && (
            <div className="mt-1 text-xs text-red-500">
              {getErrorMessage('channels')}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Calendar className="w-4 h-4 text-blue-500" />
          Timeline
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Process Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="processStartDate"
              value={formData.processStartDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.processStartDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              required
            />
            {fieldErrors.processStartDate && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('processStartDate')}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Last Communication Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="communicationEndDate"
              value={formData.communicationEndDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.communicationEndDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              required
            />
            {fieldErrors.communicationEndDate && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('communicationEndDate')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Additional Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Next Steps Communicated
            </label>
            <input
              type="text"
              name="nextStepsPromised"
              value={formData.nextStepsPromised}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What was promised?"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Days Waited Before Giving Up <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="waitingDays"
              value={formData.waitingDays}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                fieldErrors.waitingDays ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
              required
            />
            {fieldErrors.waitingDays && (
              <div className="mt-1 text-xs text-red-500">
                {getErrorMessage('waitingDays')}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your experience..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAnonymousSubmit}
            disabled={!isFormValid() || isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              isFormValid() && !isSubmitting
                ? 'bg-black hover:bg-gray-800'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Anonymously'}
          </button>
          <button
            type="button"
            onClick={handleVerifiedSubmit}
            disabled={!isFormValid() || isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              isFormValid() && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit as Verified User'}
          </button>
        </div>
      </div>
      {fieldErrors.submit && (
        <div className="mt-2 text-sm text-red-600">
          {fieldErrors.submit}
        </div>
      )}
    </form>
  );
}