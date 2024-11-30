import { Calendar, Building2, MapPin, Link, MessageSquare, Briefcase, Check, FolderTree, Send } from 'lucide-react';
import { useState } from 'react';

interface FormData {
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
  applicationSource: 'approached' | 'applied' | '';
}

interface GhostedStoryFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit?: () => void;
  onPreview?: () => void;
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
  'Initial Screening',
  'Technical Round 1',
  'Technical Round 2',
  'Take Home Assignment',
  'Behavioral/ Culture Round',
  'Final Round',
  'HR Round',
];

export default function GhostedStoryForm({ formData, setFormData, onSubmit, onPreview }: GhostedStoryFormProps) {
  const [showCustomDepartment, setShowCustomDepartment] = useState(false);
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [showCustomVertical, setShowCustomVertical] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fetchCompanyLogo = async (domain: string) => {
    if (!domain) return;
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    setFormData(prev => ({ ...prev, logo: logoUrl }));
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

  const validateForm = (): boolean => {
    const requiredFields = {
      company: 'Company Name',
      domain: 'Company Domain',
      role: 'Role',
      department: 'Department',
      industry: 'Industry',
      vertical: 'Vertical',
      yearsOfExperience: 'Years of Experience',
      location: 'Location',
      roundGhosted: 'Interview Round',
      communicationEndDate: 'Last Communication Date',
      channels: 'Communication Channels',
      waitingDays: 'Days Waited',
      processStartDate: 'Process Start Date',
      applicationSource: 'Application Source'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof FormData] || 
          (Array.isArray(formData[field as keyof FormData]) && (formData[field as keyof FormData] as any[]).length === 0) ||
          formData[field as keyof FormData] === '') {
        setValidationError(`${label} is required`);
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {validationError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {validationError}
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter company name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Company Domain</label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., company.com"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Building2 className="w-4 h-4 text-blue-500 inline-block mr-1" />
              Industry
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
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
              Business Vertical
            </label>
            <select
              name="vertical"
              value={formData.vertical}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Vertical</option>
              {verticals.map(vertical => (
                <option key={vertical} value={vertical}>{vertical}</option>
              ))}
            </select>
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

      {/* Application Source */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Application Source</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, applicationSource: 'approached' }))}
            className={`px-3 py-2 rounded-lg border text-xs transition-all ${
              formData.applicationSource === 'approached'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            They approached me
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, applicationSource: 'applied' }))}
            className={`px-3 py-2 rounded-lg border text-xs transition-all ${
              formData.applicationSource === 'applied'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            I applied directly
          </button>
        </div>
      </div>

      {/* Position Details */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <MapPin className="w-4 h-4 text-blue-500" />
          Position Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Job title"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, Country"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Briefcase className="w-4 h-4 text-blue-500 inline-block mr-1" />
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              min="0"
              max="50"
              step="0.5"
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Years of experience"
              required
            />
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
          <label className="block text-xs font-medium text-gray-700 mb-1">Ghosted After Round</label>
          <select
            name="roundGhosted"
            value={formData.roundGhosted}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            required
          >
            <option value="">Select Round</option>
            {interviewRounds.map(round => (
              <option key={round} value={round}>{round}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Communication Channels</label>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Process Start Date</label>
            <input
              type="date"
              name="processStartDate"
              value={formData.processStartDate}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Last Communication Date</label>
            <input
              type="date"
              name="communicationEndDate"
              value={formData.communicationEndDate}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Additional Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Next Steps Communicated</label>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Days Waited Before Giving Up</label>
            <input
              type="number"
              name="waitingDays"
              value={formData.waitingDays}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Comments</label>
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
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Send className="w-4 h-4" />
          Submit Story
        </button>
      </div>
    </form>
  );
}