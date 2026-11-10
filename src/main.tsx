import { StrictMode, useEffect, useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import {
  acceptHandoff, changeStatus, offerHandoff, sampleTasks, statuses, teammates,
  type Status, type Task, type Teammate,
} from './tasks';
import './style.css';

const storageKey = 'loopcrew.tasks.v1';

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : sampleTasks;
  } catch {
    return sampleTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [member, setMember] = useState<Teammate>('Taylor');
  const [title, setTitle] = useState('');
  const [editor, setEditor] = useState<{ id: string; kind: 'handoff' | 'blocker' }>();
  const [note, setNote] = useState('');
  const inbox = tasks.filter(task => task.handoff?.recipient === member);
  const blockers = tasks.filter(task => task.blocker);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  function updateTask(id: string, update: (task: Task) => Task) {
    setTasks(current => current.map(task => task.id === id ? update(task) : task));
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setTasks(current => [
      ...current,
      { id: crypto.randomUUID(), title: title.trim(), owner: member, status: 'To do' },
    ]);
    setTitle('');
  }

  function startNote(id: string, kind: 'handoff' | 'blocker') {
    setEditor({ id, kind });
    setNote('');
  }

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || !note.trim()) return;
    updateTask(editor.id, task => editor.kind === 'handoff'
      ? offerHandoff(task, member, note)
      : { ...task, blocker: note.trim() });
    setEditor(undefined);
  }

  return (
    <>
      <header className="masthead">
        <div className="brand"><span className="mark" aria-hidden="true">↻</span> LoopCrew</div>
        <label className="member">Viewing as
          <select value={member} onChange={event => {
            setMember(event.target.value as Teammate);
            setEditor(undefined);
          }}>
            {teammates.map(person => <option key={person}>{person}</option>)}
          </select>
        </label>
      </header>
      <main>
        <section className="hero" aria-labelledby="workspace">
          <p className="eyebrow">STUDENT PROJECT WORKSPACE</p>
          <h1 id="workspace">Project workspace</h1>
          <p>See who owns the next step and what’s blocking the team.</p>
        </section>
        <div className="layout">
          <section aria-labelledby="board">
            <div className="section-heading">
              <h2 id="board">Task board</h2>
              <form className="add" onSubmit={addTask}>
                <input aria-label="Task title" placeholder="Add a task" value={title} required
                  onChange={event => setTitle(event.target.value)} />
                <button className="primary">Add task</button>
              </form>
            </div>
            <div className="board">
              {statuses.map(status => {
                const column = tasks.filter(task => task.status === status);
                return (
                  <section key={status} className="column" aria-label={status}>
                    <h3>{status} <span>{column.length}</span></h3>
                    {column.map(task => (
                      <article className="task" key={task.id}>
                        <h4>{task.title}</h4>
                        <p className="owner">Owner · {task.owner}</p>
                        {task.handoff && <p className="pill pending">Handoff to {task.handoff.recipient}</p>}
                        {task.blocker && <p className="pill blocked">Blocked</p>}
                        <label className="status">
                          <span className="sr-only">Status for {task.title}</span>
                          <select value={task.status} onChange={event =>
                            updateTask(task.id, current => changeStatus(current, event.target.value as Status))}>
                            {statuses.map(option => (
                              <option key={option} disabled={option === 'Done' && !!(task.handoff || task.blocker)}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                        {task.status !== 'Done' && (
                          <div className="actions">
                            {task.owner === member && !task.handoff &&
                              <button onClick={() => startNote(task.id, 'handoff')}>Offer handoff</button>}
                            {!task.blocker &&
                              <button onClick={() => startNote(task.id, 'blocker')}>Report blocker</button>}
                          </div>
                        )}
                        {editor?.id === task.id && (
                          <form className="note" onSubmit={saveNote}>
                            <label>{editor.kind === 'handoff' ? 'Next action' : 'Blocker reason'}
                              <textarea value={note} required maxLength={180}
                                onChange={event => setNote(event.target.value)} />
                            </label>
                            <button className="primary">Save</button>
                            <button type="button" onClick={() => setEditor(undefined)}>Cancel</button>
                          </form>
                        )}
                      </article>
                    ))}
                  </section>
                );
              })}
            </div>
          </section>
          <aside aria-label="Team updates">
            <section className="panel" aria-labelledby="inbox">
              <p className="eyebrow">01 / TRANSFERS</p>
              <h2 id="inbox">Handoff inbox</h2>
              {inbox.length === 0 && <p className="muted">No handoffs waiting for {member}.</p>}
              {inbox.map(task => (
                <article key={task.id}>
                  <h3>{task.title}</h3>
                  <p className="muted">From {task.owner} · {task.handoff?.note}</p>
                  <button onClick={() => updateTask(task.id, current => acceptHandoff(current, member))}>
                    Accept handoff
                  </button>
                </article>
              ))}
            </section>
            <section className="panel" aria-labelledby="blockers">
              <p className="eyebrow">02 / NEEDS ACTION</p>
              <h2 id="blockers">Blocker queue</h2>
              {blockers.length === 0 && <p className="muted">No open blockers.</p>}
              {blockers.map(task => (
                <article key={task.id}>
                  <h3>{task.title}</h3>
                  <p className="muted">{task.blocker}</p>
                  <button onClick={() => updateTask(task.id, current => ({ ...current, blocker: undefined }))}>
                    Mark resolved
                  </button>
                </article>
              ))}
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
