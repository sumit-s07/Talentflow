import React, { useState, useEffect } from 'react';
import type { Job, JobFormData } from '@/data/JobsData/Jobs.types';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Job | Omit<Job, 'id'>) => void;
  initialData: Job | null;
  allTags: string[];
  isSubmitting: boolean;
}

const defaultFormData: JobFormData = {
  title: '',
  company: '',
  location: '',
  jobType: 'Full-Time',
  experience: { min: 0, max: 0 },
  salary: { min: 50000, max: 70000, currency: 'USD', period: 'annually' },
  status: 'active',
  tags: [],
  order: 0,
};

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSubmit, initialData, allTags,isSubmitting }) => {
  const [formData, setFormData] = useState<JobFormData>(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const { id, postedDate, ...initialFormData } = initialData;
        setFormData({
            ...defaultFormData, // Ensure all keys are present
            ...initialFormData
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [initialData, isOpen]);
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (name.includes('.')) {
        const [key, subkey] = name.split('.') as ['experience' | 'salary', 'min' | 'max'];
        
        const nestedObject = prev[key] || {};

        return {
          ...prev,
          [key]: {
            ...nestedObject,
            [subkey]: Number(value) || 0
          }
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
        ...prev,
        tags: prev.tags.includes(tag)
            ? prev.tags.filter((t: string) => t !== tag)
            : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      postedDate: initialData?.postedDate || new Date().toISOString(),
    };

    if (initialData) {
      onSubmit({ ...finalData, id: initialData.id });
    } else {
      onSubmit(finalData as Omit<Job, 'id'>);
    }
  };

  if (!isOpen) return null;
  const isEditMode = !!initialData;
return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-xl w-full max-w-2xl z-50 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Job' : 'Create New Job'}</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-300 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="title">Job Title</label>
            <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="company">Company</label>
              <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="location">Location</label>
              <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="jobType">Job Type</label>
              <select id="jobType" name="jobType" value={formData.jobType} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset className="border p-3 rounded-md dark:border-gray-600">
              <legend className="text-sm font-bold px-1">Experience (Years)</legend>
              <div className="flex gap-2">
                <input name="experience.min" type="number" value={formData.experience?.min || ''} onChange={handleChange} placeholder="Min" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                <input name="experience.max" type="number" value={formData.experience?.max || ''} onChange={handleChange} placeholder="Max" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </fieldset>
            <fieldset className="border p-3 rounded-md dark:border-gray-600">
              <legend className="text-sm font-bold px-1">Salary ($ Annually)</legend>
              <div className="flex gap-2">
                <input name="salary.min" type="number" value={formData.salary?.min || ''} onChange={handleChange} placeholder="Min" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                <input name="salary.max" type="number" value={formData.salary?.max || ''} onChange={handleChange} placeholder="Max" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </fieldset>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md dark:border-gray-600">
              {allTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-md hover:bg-gray-300">Cancel</button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? (isEditMode ? 'Saving...' : 'Creating...')
                : (isEditMode ? 'Save Changes' : 'Create Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;

