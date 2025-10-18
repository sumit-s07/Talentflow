import { db } from './db';
import { generateSeedCandidates } from '../../data/CandidatesFunctions/mockCandidates';
import type { Assessment } from '../../data/AssessmentFunctions/assessment';
import type { Job, JobType, Salary, Experience, JobStatus } from '@/data/JobsData/Jobs.types';

const TAG_POOL = ['React', 'TypeScript', 'Node.js', 'Remote', 'GraphQL', 'CSS', 'Senior', 'JavaScript', 'Mid-Level', 'Contract', 'Vue', 'Angular', 'AWS'];

function generateRandomJobs(): Omit<Job, 'id'>[] {
  const jobs: Omit<Job, 'id'>[] = [];
  const titles = ['Software Engineer', 'Product Designer', 'Frontend Developer', 'Data Analyst', 'UX Designer', 'Marketing Manager'];
  const companies = ['TalentFlow'];
  const locations = ['Chicago, IL', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Remote'];
  const jobTypes: JobType[] = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
  const totalJobs = 25;
  const statuses: JobStatus[] = ['active', 'active', 'active', 'archived', 'inactive'];

  for (let i = 1; i <= totalJobs; i++) {
    const salaryMin = Math.floor(Math.random() * 40 + 50) * 1000; 
    const salary: Salary = {
      min: salaryMin,
      max: salaryMin + Math.floor(Math.random() * 20 + 5) * 1000,
      currency: 'USD',
      period: 'annually'
    };
    
   
    const expMin = Math.floor(Math.random() * 5); 
    const experience: Experience = {
      min: expMin,
      max: expMin + Math.floor(Math.random() * 3 + 2), 
    };
    
    const postedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const randomTags = TAG_POOL.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);

    jobs.push({
      title: titles[i % titles.length],
      status: statuses[i % statuses.length],
      tags: randomTags,
      order: i,
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      jobType: jobTypes[i % jobTypes.length],
      experience,
      salary,
      postedDate,
    });
  }
  return jobs;
}

function generateSeedAssessments(totalJobs: number): Omit<Assessment, 'id'>[] {
    const assessments: Omit<Assessment, 'id'>[] = [];

    for (let i = 1; i <= totalJobs; i++) {
        assessments.push({
            jobId: i, 
            title: "Default Technical Screening",
            sections: [
                {
                    id: `sec-${i}-1`,
                    title: "Core Competency",
                    questions: [
                        { 
                            id: `q-${i}-1-1`, 
                            text: "Describe a challenging project you've worked on and your role in it.", 
                            isRequired: true, 
                            details: { type: 'long-text' } 
                        },
                        { 
                            id: `q-${i}-1-2`, 
                            text: "Which of these technologies are you most proficient in?", 
                            isRequired: true, 
                            details: { type: 'multi-choice', options: ['JavaScript', 'Python', 'Java', 'C#'] },
                            correctAnswer: ['JavaScript']
                        }
                    ]
                }
            ]
        });
    }
    return assessments;
}

export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  const candidateCount = await db.candidates.count();
  const assessmentCount = await db.assessments.count();

  if (jobCount === 0 && candidateCount === 0 && assessmentCount === 0) {
    console.log("Seeding database with initial data...");
    
    const initialJobs = generateRandomJobs();
    await db.jobs.bulkAdd(initialJobs as Job[]);
    console.log(` ${initialJobs.length} jobs seeded.`);

    const totalJobs = initialJobs.length;
    const initialCandidates = generateSeedCandidates(totalJobs);
    await db.candidates.bulkAdd(initialCandidates);
    console.log(` ${initialCandidates.length} candidates seeded.`);

    const initialAssessments = generateSeedAssessments(totalJobs);
    await db.assessments.bulkAdd(initialAssessments as Assessment[]);
    console.log(` ${initialAssessments.length} assessments seeded.`);
    
    console.log("Database seeded successfully.");
  }
}