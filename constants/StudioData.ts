export const TEAMS = [
  { id: 'T1', name: 'Tim 1' },
  { id: 'T2', name: 'Tim 2' },
  { id: 'T3', name: 'Tim 3' },
  { id: 'T4', name: 'Tim 4' },
  { id: 'T5', name: 'Tim 5', isSpecial: true },
];

export const WORKFLOW_STEPS = [
  {
    id: '1',
    title: 'Konsep (Pre-Pro)',
    tasks: ['Pahami Brief', 'Download Aset', 'Scripting'],
  },
  {
    id: '2',
    title: 'Produksi (Shooting)',
    tasks: ['Cam: 1080p 30fps', 'Ratio: 9:16', 'Lighting Aman'],
  },
  {
    id: '3',
    title: 'Audio (Voice Over)',
    tasks: ['No Noise', 'Intonasi Jelas', 'Audio Level Pas'],
  },
  {
    id: '4',
    title: 'Editing (Post-Pro)',
    isGatekeeper: true,
    tasks: ['Cutting Rapi', 'Subtitle Safe Area', 'Grading Pop', 'Upload Preview (480p)'],
  },
  {
    id: '5',
    title: 'Final Submission',
    tasks: ['Cek 1080p Final', 'Upload Link Result'],
  },
];

/**
 * Helper constant yang mengekstrak semua nama task dari WORKFLOW_STEPS 
 * menjadi satu array flat (1D array).
 */
export const ALL_TASK_IDS = WORKFLOW_STEPS.flatMap((step) => step.tasks);

export const DUMMY_PROJECTS = [
  {
    id: '1',
    title: 'Video Edukasi Reguler',
    teamId: 'team-1',
    isBigProject: false,
    status: 'In Progress',
    progress: 40,
    isApproved: false,
    completedTasks: ['Pahami Brief', 'Download Aset'],
    previewLink: '',
    finalLink: '',
    feedback: '',
  },
  {
    id: '2',
    title: 'Film Pendek RoboEdu',
    teamId: 'team-5',
    isBigProject: true,
    status: 'In Progress',
    progress: 10,
    proposalStatus: 'None',
    script: 'Int. Ruang Kelas - Siang\n\nBudi sedang merakit robot...',
    equipment: '1. Kamera Sony A7\n2. Tripod',
    previewImages: Array(20).fill(null),
    finalLink: '',
    feedback: '',
  },
];