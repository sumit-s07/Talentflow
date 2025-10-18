export interface Candidate {
  id: number;
  jobId: number;
  name: string;
  email: string;
  order?: number;
  currentStage: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
  stageHistory: { stage: string; timestamp: string }[];
  notes?: Note[];
}
export interface Note {
  noteId: number,
  text: string;
  timestamp: string;
}

const STAGES = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'] as const;

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan'];
const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Thakur', 'Chauhan', 'Patel'];


export function generateSeedCandidates(totalJobs: number): Omit<Candidate, 'id'>[] {
    const candidates: Omit<Candidate, 'id'>[] = [];
    const totalCandidates = 1000;
    const candidatesPerJob = Math.floor(totalCandidates / totalJobs);

    for (let i = 0; i < totalCandidates; i++) {
        const stageIndex = Math.floor((i % candidatesPerJob) / (candidatesPerJob / STAGES.length));
        const currentStage = STAGES[Math.min(stageIndex, STAGES.length - 1)];
        const orderInStage = i % (candidatesPerJob / STAGES.length);

        const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const name = `${randomFirstName} ${randomLastName}`;
        const email = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${i}@example.com`;

        candidates.push({
            jobId: (i % totalJobs) + 1,
            name: name,
            email: email,
            currentStage,
            order: orderInStage,
            stageHistory: [{
                stage: currentStage,
                timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
            }],
            notes: [],
        });
    }
    return candidates;
}

