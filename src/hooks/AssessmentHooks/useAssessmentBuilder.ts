import { useState, useEffect } from 'react';
import type { Assessment } from '../../data/AssessmentFunctions/assessment';
import { fetchAssessmentsForJob, createAssessment, updateAssessment, deleteAssessment } from '../../api/JobsApi/AssessmentApi';

export const useAssessmentBuilder = (jobId: string | undefined) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const numericJobId = jobId ? parseInt(jobId, 10) : 0;

  useEffect(() => {
    const loadAssessments = async () => {
      if (!numericJobId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const existingAssessments = await fetchAssessmentsForJob(numericJobId);
        setAssessments(existingAssessments);
      } catch (error) {
        console.error("Failed to load assessments:", error);
        setAssessments([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadAssessments();
  }, [jobId]);

  const handleCreateAssessment = async () => {
    if (!numericJobId) return;

    const newAssessmentData: Omit<Assessment, 'id'> = {
      jobId: numericJobId,
      title: `New Assessment #${assessments.length + 1}`,
      sections: [],
    };
    
    try {
      const createdAssessment = await createAssessment(numericJobId, newAssessmentData);
      setAssessments(prev => [...prev, createdAssessment]);
      return createdAssessment;
    } catch (error) {
      console.error("Failed to create assessment:", error);
      alert("Error: Could not create the assessment.");
      return null;
    }
  };

  const handleUpdateAssessment = async (assessmentToUpdate: Assessment) => {
    try {
        await updateAssessment(assessmentToUpdate);
    } catch (error) {
        console.error("Failed to update assessment:", error);
        alert("Error: Could not save changes.");
    }
  };
  
  const handleDeleteAssessment = async (assessmentId: number) => {
    setAssessments(prev => prev.filter(asmnt => asmnt.id !== assessmentId));
    
    try {
      await deleteAssessment(assessmentId);
    } catch (error) {
        console.error("Failed to delete assessment:", error);
        alert("Error: Could not delete assessment.");
    }
  };
  
  return { 
    assessments, 
    setAssessments, 
    isLoading, 
    handleCreateAssessment, 
    handleUpdateAssessment, 
    handleDeleteAssessment,
  };
};
