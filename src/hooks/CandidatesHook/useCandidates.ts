import { useState, useEffect, useMemo } from 'react';
import * as candidateApi from '../../api/candidatesApi/candidateApi';
import type { Candidate } from '../../data/CandidatesFunctions/mockCandidates';


export const useCandidates = (jobId: number | undefined) => {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (!jobId) {
      setAllCandidates([]);
      setIsLoading(false);
      return;
    }

    const getCandidates = async () => {
      setIsLoading(true);
      try {
        const data = await candidateApi.fetchCandidatesForJob(jobId, stageFilter);
        setAllCandidates(data);
      } catch (error) {
          console.error(`Failed to fetch candidates for job ${jobId}:`, error);
          setAllCandidates([]); 
      } finally {
        setIsLoading(false);
      }
    };
    
    getCandidates();
  }, [jobId, stageFilter]);

  const searchedCandidates = useMemo(() => {
    if (!searchTerm) {
      return allCandidates;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return (allCandidates || []).filter(c =>
      c.name.toLowerCase().includes(lowercasedTerm) ||
      c.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [allCandidates, searchTerm]);

  return {
    isLoading,
    searchedCandidates,
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
    setAllCandidates,
  };
};

