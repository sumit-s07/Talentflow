import { http } from 'msw';
import { db } from '../db';
import type { Assessment, AssessmentResponse } from '../../AssessmentFunctions/assessment';

export const AssessmentHandler = [
  http.get('/api/jobs/:jobId/assessments', async ({ params }) => {
    const jobId = Number(params.jobId);
    const assessments = await db.assessments.where('jobId').equals(jobId).toArray();
    return Response.json(assessments);
  }),

  http.get('/api/assessments/:assessmentId', async ({ params }) => {
      const assessmentId = Number(params.assessmentId);
      const assessment = await db.assessments.get(assessmentId);
      if (assessment) {
          return Response.json(assessment);
      }
      return new Response(null, { status: 204 }); // No Content if not found
  }),

  // Create a new assessment
  http.post('/api/jobs/:jobId/assessments', async ({ request }) => {
    const assessmentData = (await request.json()) as Omit<Assessment, 'id'>;
    const newId = await db.assessments.add(assessmentData as Assessment);
    const newAssessment = await db.assessments.get(newId);
    return Response.json(newAssessment, { status: 201 });
  }),

  // Update an existing assessment
  http.put('/api/assessments/:assessmentId', async ({ request, params }) => {
    const assessmentId = Number(params.assessmentId);
    const updatedData = (await request.json()) as Assessment;
    await db.assessments.put(updatedData, assessmentId);
    const updatedAssessment = await db.assessments.get(assessmentId);
    return Response.json(updatedAssessment);
  }),

  // Delete an assessment
  http.delete('/api/assessments/:assessmentId', async ({ params }) => {
    const assessmentId = Number(params.assessmentId);
    await db.assessments.delete(assessmentId);
    return new Response(null, { status: 204 });
  }),
  
  // Save a candidate's response to an assessment
  http.post('/api/assessments/responses', async ({ request }) => {
    const responseData = (await request.json()) as Omit<AssessmentResponse, 'id'>;
    const newId = await db.assessmentResponses.add(responseData as AssessmentResponse);
    const newResponse = await db.assessmentResponses.get(newId);
    return Response.json(newResponse, { status: 201 });
  }),
];

