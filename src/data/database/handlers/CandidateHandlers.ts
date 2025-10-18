import { http } from 'msw';
import { db } from '../db';
import type { Candidate, Note } from '../../CandidatesFunctions/mockCandidates';

export const candidateHandlers = [
  // Handler to get candidates for a specific job
  http.get('/api/jobs/:jobId/candidates', async ({ params, request }) => {
    const jobId = Number(params.jobId);
    const url = new URL(request.url);
    const stage = url.searchParams.get('stage');

    let query = db.candidates.where('jobId').equals(jobId);

    if (stage && stage !== 'all') {
      query = query.and(candidate => candidate.currentStage === stage);
    }

    const candidates = await query.toArray();
    return Response.json(candidates);
  }),

  // Handler to get a single candidate by their ID
  http.get('/api/candidates/:candidateId', async ({ params }) => {
    const candidateId = Number(params.candidateId);
    const candidate = await db.candidates.get(candidateId);

    if (candidate) {
      return Response.json(candidate);
    }
    // Return a 204 No Content if not found, which the API function will handle
    return new Response(null, { status: 204 });
  }),

  // Handler to update a candidate
  http.put('/api/candidates/:candidateId', async ({ request }) => {
    const updatedCandidate = (await request.json()) as Candidate;
    await db.candidates.put(updatedCandidate);
    return Response.json(updatedCandidate);
  }),

  // Handler to add a new note to a candidate
  http.post('/api/candidates/:candidateId/notes', async ({ params, request }) => {
    const candidateId = Number(params.candidateId);
    const { noteText } = (await request.json()) as { noteText: string };

    const candidate = await db.candidates.get(candidateId);

    if (!candidate) {
      return new Response('Candidate not found', { status: 404 });
    }

    const newNote: Note = {
      noteId: Date.now(), // Use a timestamp for a unique ID
      text: noteText,
      timestamp: new Date().toISOString(),
    };

    candidate.notes = [...(candidate.notes || []), newNote];
    await db.candidates.put(candidate);

    return Response.json(candidate);
  }),

  // Handler to delete a note from a candidate
  http.delete('/api/candidates/:candidateId/notes/:noteId', async ({ params }) => {
    const candidateId = Number(params.candidateId);
    const noteId = Number(params.noteId);

    const candidate = await db.candidates.get(candidateId);

    if (!candidate) {
      return new Response('Candidate not found', { status: 404 });
    }

    const updatedNotes = (candidate.notes || []).filter(note => note.noteId !== noteId);
    
    // Update the candidate in the database with the modified notes array
    await db.candidates.update(candidateId, { notes: updatedNotes });
    
    // Fetch the fully updated candidate to return in the response
    const updatedCandidate = await db.candidates.get(candidateId);

    return Response.json(updatedCandidate);
  }),
];

