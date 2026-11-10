# Midpoint walkthrough

## Before the walkthrough

Run `npm ci`, then `npm run dev`. Open the local URL in a fresh browser profile to see the sample tasks. Select **Taylor** in **Viewing as**.

## Acceptance checks

1. **Task board.** Create a new task. Confirm it appears under **To do** with Taylor as the owner. Set its status to **In progress** and verify it moves to that column.
2. **Handoff.** Offer the new task to Sam with a next-action note. The task should still show Taylor as owner. Switch to Sam and confirm the note appears in **Handoff inbox**. Accept the handoff and check that the owner changes to Sam and the inbox entry disappears.
3. **Blocker.** Report a blocker and enter a reason. Confirm that the task shows **Blocked** and appears in **Blocker queue**. Select **Mark resolved** and confirm both indicators disappear.

## Evidence

For the report, capture the workspace before accepting the sample handoff while viewing it as Sam. Keep the task owner, handoff inbox, and blocker queue visible. Record usability observations separately under participant codes.

