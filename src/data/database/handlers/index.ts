import { jobsHandlers } from './JobHandlers';
import {candidateHandlers} from './CandidateHandlers';
import { AssessmentHandler } from './AssessmentHandlers';


export const handlers = [
  ...jobsHandlers,
  ...candidateHandlers,
  ...AssessmentHandler
 
];