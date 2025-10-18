import type { Candidate } from '../../data/CandidatesFunctions/mockCandidates';

import {db} from '../../data/database/db'
export async function fetchCandidatesForJob(jobId: number, stageFilter: string | 'all'): Promise<Candidate[]> {
  const response = await fetch(`/api/jobs/${jobId}/candidates?stage=${stageFilter}`);
  if (!response.ok) {
    throw new Error('Failed to fetch candidates for job');
  }
  return response.json();
}
export async function fetchCandidates(params: { page: number; pageSize: number }): Promise<{ data: Candidate[]; totalCount: number }> {
  const totalCount = await db.candidates.count();
  const data = await db.candidates
    .offset((params.page - 1) * params.pageSize)
    .limit(params.pageSize)
    .toArray();
  
  return { data, totalCount };
}
/**
 * Fetches a single candidate by their unique ID.
 */
export async function getCandidateById(candidateId: number): Promise<Candidate | null> {
  const response = await fetch(`/api/candidates/${candidateId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch candidate');
  }

  if (response.status === 204) return null;
  return response.json();
}

/**
 * Updates a candidate's details.
 */
export async function updateCandidate(updatedCandidate: Candidate): Promise<Candidate> {
  const response = await fetch(`/api/candidates/${updatedCandidate.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCandidate),
  });
  if (!response.ok) {
    throw new Error('Failed to update candidate');
  }
  return response.json();
}

/**
 * Adds a new note to a specific candidate's profile.
 */
export async function addNoteToCandidate(candidateId: number, noteText: string): Promise<Candidate> {
    const response = await fetch(`/api/candidates/${candidateId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteText }),
    });
    if (!response.ok) {
        throw new Error('Failed to add note');
    }
    return response.json();
}

/**
 * Deletes a note from a specific candidate's profile.
 */
export async function deleteNoteFromCandidate(candidateId: number, noteId: number): Promise<Candidate> {
  const response = await fetch(`/api/candidates/${candidateId}/notes/${noteId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
  return response.json();
}

