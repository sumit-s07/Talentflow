import { http, HttpResponse } from 'msw';
import { db } from '../db'; 
import type { Job } from '@/data/JobsData/Jobs.types';

interface ReorderRequestBody {
  reorderedJobs: Job[];
}
export const jobsHandlers = [
  
  http.get('/api/jobs', async ({ request }) => {
    const url = new URL(request.url);
    const params = url.searchParams;

    const page = parseInt(params.get('page') || '1', 10);
    const pageSize = parseInt(params.get('pageSize') || '5', 10);
    const search = params.get('search')?.toLowerCase();
    const status = params.get('status');
    const tags = params.getAll('tags');
    const jobTypes = params.getAll('jobType');
    const experience = params.get('experience');
    const sortBy = params.get('sortBy');
    const sortOrder = params.get('sortOrder') || 'asc'; 

    let allJobs = await db.jobs.toArray();

    if (search) {
      allJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(search) || 
        job.company.toLowerCase().includes(search)
      );
    }
    if (status && status !== 'all') {
      allJobs = allJobs.filter(job => job.status === status);
    }
    if (tags.length > 0) {
      allJobs = allJobs.filter(job => tags.every(tag => job.tags.includes(tag)));
    }
    if (jobTypes.length > 0) {
      allJobs = allJobs.filter(job => jobTypes.includes(job.jobType));
    }
    if (experience && experience !== 'all') {
      const [minStr, maxStr] = experience.split('-');
      const min = parseInt(minStr, 10);
      const max = maxStr ? parseInt(maxStr, 10) : Infinity;
      allJobs = allJobs.filter(job => job.experience.max >= min && job.experience.min <= max);
    }

    
    if (sortBy && sortBy !== 'order') { // 'order' is the default, no sort needed
        allJobs.sort((a, b) => {
            let valA: string | number | undefined;
            let valB: string | number | undefined;

            // Type-safe property access
            switch (sortBy as keyof Job) {
                case 'title':
                case 'status':
                    valA = a[sortBy];
                    valB = b[sortBy];
                    break;
                case 'postedDate':
                    valA = new Date(a.postedDate).getTime();
                    valB = new Date(b.postedDate).getTime();
                    break;
                case 'salary':
                    valA = a.salary?.min ?? 0;
                    valB = b.salary?.min ?? 0;
                    break;
                default:
                    valA = a[sortBy as keyof Job] as any;
                    valB = b[sortBy as keyof Job] as any;
            }
            // The actual comparison logic
            if (valA === undefined || valB === undefined) return 0;
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    } else {
      // Default sort by 'order' property if no other sortBy is specified
      allJobs.sort((a, b) => a.order - b.order);
    }

    // Pagination
    const totalCount = allJobs.length;
    const paginatedData = allJobs.slice((page - 1) * pageSize, page * pageSize);

    return HttpResponse.json({ data: paginatedData, totalCount });
  }),

  http.patch('/api/jobs/reorder', async ({ request }) => {
    const { reorderedJobs } = await request.json() as ReorderRequestBody;
    if (!reorderedJobs) {
      return new HttpResponse('Bad Request: Missing reorderedJobs', { status: 400 });
    }
    await db.jobs.bulkPut(reorderedJobs);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/tags', async () => {
    const allJobs = await db.jobs.toArray();
    const uniqueTags = [...new Set(allJobs.flatMap(job => job.tags))];
    return HttpResponse.json(uniqueTags.sort());
  }),

  http.post('/api/jobs', async ({ request }) => {
    const newJobData = await request.json() as Omit<Job, 'id'>;
    const newId = await db.jobs.add(newJobData);
    const newJob = await db.jobs.get(newId);
    return HttpResponse.json(newJob, { status: 201 }); 
  }),

  http.patch('/api/jobs/:id', async ({ request, params }) => {
    const jobId = Number(params.id);
    const updates = await request.json() as Partial<Job>;

    if (!updates || typeof updates !== 'object') {
        return new HttpResponse('Bad Request: Invalid update data', { status: 400 });
    }

    await db.jobs.update(jobId, updates);
    const updatedJob = await db.jobs.get(jobId);
    return HttpResponse.json(updatedJob);
  }),

  http.put('/api/jobs/:id', async ({ request, params }) => {
    const jobId = Number(params.id);
    const updatedJobData = await request.json() as Partial<Job>;

    if (!updatedJobData || typeof updatedJobData !== 'object') {
      return new HttpResponse('Invalid job data', { status: 400 });
    }

    await db.jobs.put({ ...updatedJobData, id: jobId });
    const updatedJob = await db.jobs.get(jobId);
    return HttpResponse.json(updatedJob);
  }),

  http.get('/api/jobs/:id', async ({ params }) => {
    const jobId = Number(params.id);
    const job = await db.jobs.get(jobId);
    if (job) {
      return HttpResponse.json(job);
    } else {
      return new HttpResponse(JSON.stringify({ message: 'Job not found' }), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
  
  http.delete('/api/jobs/:id', async ({ params }) => {
    const jobId = Number(params.id);
    await db.jobs.delete(jobId);
    return new HttpResponse(null, { status: 204 });
  }),
];

