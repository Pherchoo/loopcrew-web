export const statuses = ['To do', 'In progress', 'Done'] as const;
export const teammates = ['Taylor', 'Sam'] as const;

export type Status = typeof statuses[number];
export type Teammate = typeof teammates[number];
export type Task = {
  id: string;
  title: string;
  status: Status;
  owner: Teammate;
  blocker?: string;
  handoff?: { recipient: Teammate; note: string };
};

export function offerHandoff(task: Task, sender: Teammate, note: string): Task {
  if (sender !== task.owner || task.handoff || task.status === 'Done' || !note.trim()) return task;
  const recipient = teammates.find(teammate => teammate !== sender)!;
  return { ...task, handoff: { recipient, note: note.trim() } };
}

export function acceptHandoff(task: Task, recipient: Teammate): Task {
  if (task.handoff?.recipient !== recipient) return task;
  return { ...task, owner: recipient, handoff: undefined };
}

export function changeStatus(task: Task, status: Status): Task {
  if (status === 'Done' && (task.blocker || task.handoff)) return task;
  return { ...task, status };
}

export const sampleTasks: Task[] = [
  { id: 'brief', title: 'Draft the project brief', status: 'To do', owner: 'Taylor' },
  { id: 'survey', title: 'Prepare the pilot survey', status: 'In progress', owner: 'Taylor',
    handoff: { recipient: 'Sam', note: 'Review the wording on questions 2 and 3.' } },
  { id: 'mobile', title: 'Check the mobile layout', status: 'In progress', owner: 'Sam',
    blocker: 'Waiting for the handoff screen to be ready.' },
  { id: 'goals', title: 'Agree on the sprint goals', status: 'Done', owner: 'Taylor' },
];
