import { describe, expect, it } from 'vitest';
import { acceptHandoff, changeStatus, offerHandoff, type Task } from './tasks';

const task: Task = { id: '1', title: 'Review the layout', status: 'In progress', owner: 'Taylor' };

describe('task workflow', () => {
  it('retains the owner until the assigned recipient accepts', () => {
    const pending = offerHandoff(task, 'Taylor', 'Check the mobile layout.');
    expect(pending.owner).toBe('Taylor');
    expect(acceptHandoff(pending, 'Taylor')).toBe(pending);
    expect(acceptHandoff(pending, 'Sam')).toEqual({ ...task, owner: 'Sam', handoff: undefined });
  });

  it('requires a current owner and a next-action note', () => {
    expect(offerHandoff(task, 'Sam', 'Check layout.')).toBe(task);
    expect(offerHandoff(task, 'Taylor', '  ')).toBe(task);
  });

  it('requires a blocker or handoff to be resolved before completion', () => {
    const blocked = { ...task, blocker: 'Needs review' };
    const pending = offerHandoff(task, 'Taylor', 'Check layout.');
    expect(changeStatus(blocked, 'Done')).toBe(blocked);
    expect(changeStatus(pending, 'Done')).toBe(pending);
    expect(changeStatus(task, 'Done').status).toBe('Done');
  });
});
