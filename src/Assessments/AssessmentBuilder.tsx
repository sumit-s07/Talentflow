import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Assessment, Section } from '../data/AssessmentFunctions/assessment';
import SectionEditor from '../components/AssessmentComponents/SectionEditor';
import AssessmentPreview from '../components/AssessmentComponents/AssessmentPreview';
import { useAssessmentBuilder } from '../hooks/AssessmentHooks/useAssessmentBuilder';

const SaveButton: React.FC<{ isDirty: boolean; onClick: () => void; }> = ({ isDirty, onClick }) => {
    return (
        <button 
          onClick={onClick} 
          disabled={!isDirty} 
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          Save Changes
        </button>
    );
};

const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { 
    assessments,
    setAssessments,
    isLoading, 
    handleCreateAssessment,
    handleUpdateAssessment,
    handleDeleteAssessment,
  } = useAssessmentBuilder(jobId);

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleSelectForEdit = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsDirty(false); 
  };
  
  const handleCreateAndEdit = async () => {
      const newAssessment = await handleCreateAssessment();
      if (newAssessment) {
          handleSelectForEdit(newAssessment);
      }
  };

  const handleLocalUpdate = (updatedAssessment: Assessment) => {
    setSelectedAssessment(updatedAssessment);
    setAssessments(prev => prev.map(a => a.id === updatedAssessment.id ? updatedAssessment : a));
    setIsDirty(true);
  };

  const handleSaveChanges = () => {
    if (selectedAssessment) {
      handleUpdateAssessment(selectedAssessment);
      setIsDirty(false); 
    }
  };
  
  const handleAddSection = () => {
    if (!selectedAssessment) return;
    const newSection: Section = { id: `sec-${Date.now()}`, title: 'New Section', questions: [] };
    handleLocalUpdate({ ...selectedAssessment, sections: [...selectedAssessment.sections, newSection] });
  };

  const handleUpdateSection = (updatedSection: Section) => {
    if (!selectedAssessment) return;
    handleLocalUpdate({
      ...selectedAssessment,
      sections: selectedAssessment.sections.map(s => s.id === updatedSection.id ? updatedSection : s),
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedAssessment) return;
    handleLocalUpdate({
      ...selectedAssessment,
      sections: selectedAssessment.sections.filter(s => s.id !== sectionId),
    });
  };

  const handleTitleChange = (newTitle: string) => {
    if (!selectedAssessment) return;
    handleLocalUpdate({ ...selectedAssessment, title: newTitle });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Assessments...</div>;
  }
  
  if (selectedAssessment) {
    const allQuestions = selectedAssessment.sections.flatMap(s => s.questions);
    return (
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
          <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                  <div>
                      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Assessment Editor</h1>
                  </div>
                  <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedAssessment(null)} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                          &larr; Back to List
                      </button>
                      <SaveButton isDirty={isDirty} onClick={handleSaveChanges} />
                  </div>
              </div>
          </div>
          <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 p-6 overflow-y-auto">
                  <input type="text" value={selectedAssessment.title} onChange={(e) => handleTitleChange(e.target.value)} className="text-2xl font-bold w-full p-2 mb-8 bg-transparent text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500" />
                  <div className="space-y-6">
                      {selectedAssessment.sections.map((section) => (
                          <SectionEditor key={section.id} section={section} allQuestions={allQuestions} updateSection={handleUpdateSection} deleteSection={() => handleDeleteSection(section.id)} />
                      ))}
                  </div>
                  <button onClick={handleAddSection} className="mt-8 w-full flex items-center justify-center gap-2 py-3 text-blue-600 dark:text-blue-400 font-semibold border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all">+ Add Section</button>
              </div>
              <div className="w-1/2 p-6 bg-white dark:bg-gray-800/50 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 sticky top-0 bg-white dark:bg-gray-800/50 py-2">Live Preview</h2>
                  <AssessmentPreview assessment={selectedAssessment} />
              </div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
            <Link to={`/jobs/${jobId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Job Details
            </Link>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Assessments</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all skills assessments for this job.</p>
              </div>
              <button onClick={handleCreateAndEdit} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-green-500">
                  <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  Create New
              </button>
          </div>
        </div>
        <div className="space-y-4">
          {assessments.map(assessment => (
            <div key={assessment.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{assessment.title}</span>
                  <div className="flex items-center gap-2">
                    <Link to={`/jobs/${jobId}/assessment-preview/${assessment.id}`} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Preview</Link>
                    <button onClick={() => handleSelectForEdit(assessment)} className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Edit</button>
                    <button onClick={() => handleDeleteAssessment(assessment.id)} className="p-2 text-gray-400 dark:text-gray-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
              </div>
            </div>
          ))}
          {assessments.length === 0 && (
              <div className="text-center bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-gray-500 dark:text-gray-400">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">No Assessments Found</h3>
                  <p>Get started by creating the first assessment for this job.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilder;