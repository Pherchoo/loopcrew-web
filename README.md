# LoopCrew

LoopCrew is a browser-based project workspace for student teams. It combines a task board, an inbox for ownership handoffs, and a queue for blockers.

## Run locally

Use Node.js 22.13 or later.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. The starter workspace uses sample tasks and stores changes in this browser. Switch **Viewing as** to try a handoff from both sides. Shared accounts, server storage, and the weekly recap are future work.

## Development workflow

1. Open or pick an issue with a clear acceptance check. Sync `main`, then branch with a name such as `feat/12-handoff-inbox` or `fix/12-blocker-label`.
2. Keep the change focused. Run `npm run lint`, `npm test`, and `npm run build` before requesting review.
3. Open a pull request against `main`. Link the issue with `Closes #<issue>`, document verification, and attach a screenshot for UI changes. Use draft status while the change is in progress.
4. Ask a teammate with write access to review. The reviewer checks the acceptance criteria, edge cases, test evidence, and keyboard access for UI changes. Address feedback and request a new review after substantive changes.
5. Squash merge after one independent approval, passing CI checks, and resolved conversations. Delete the feature branch, verify the issue closed, and smoke-test `main`. Use a reviewed revert PR if a merge breaks a core flow.

## Repository administration

The target rule for `main` requires one independent approval, dismissal of stale approvals, all review threads resolved, and the `lint`, `test`, and `build` checks. The rule also blocks force pushes, branch deletion, and administrator bypass. A repository administrator can enforce the rule when GitHub branch protection is available on the account and repository. Until it is enforced, follow the review policy manually.

GitHub Actions runs lint, unit tests, and a production build on pull requests and pushes to `main`. Use the PR and issue templates to keep work traceable.
