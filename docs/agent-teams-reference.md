# Agent Teams — Master Reference

Source: <https://code.claude.com/docs/en/agent-teams> (fetched 2026-11-10).
Agent teams are **experimental**; behavior is version-dependent. Re-check the source if something here doesn't match what you observe.

This project has them enabled in `.claude/settings.local.json` (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`).

---

## 1. Decide first: team, subagents, or single session?

| Situation | Use |
| --- | --- |
| Sequential work, same-file edits, many dependencies between steps | **Single session** |
| Focused workers where only the result matters | **Subagents** |
| Workers need to share findings, challenge each other, self-coordinate | **Agent team** |
| Routine task | **Single session** (teams cost far more tokens) |

Strongest team use cases:

- **Research and review** — several angles investigated at once, then cross-challenged.
- **New modules/features** — each teammate owns a separate piece.
- **Debugging with competing hypotheses** — parallel theories, adversarial debate.
- **Cross-layer work** — frontend / backend / tests each owned by one teammate.

|  | Subagents | Agent teams |
| --- | --- | --- |
| Context | Own window; result returns to caller | Own window; fully independent |
| Communication | Return a result (named subagents can also message each other) | Teammates message each other directly |
| Coordination | Main agent manages everything | Self-coordination via messages + shared task list |
| Token cost | Lower | Higher — each teammate is a full Claude instance |

Rule of thumb: if teammates would not need to talk to each other, it is not a team task.

---

## 2. How a team actually starts

- A teammate launches when the lead calls the **Agent tool with a `name`** while teams are enabled — unless the call is a **fork** or passes **`isolation`** on the call itself. No confirmation prompt.
- **Side effect of enabling teams:** any subagent Claude names launches as a teammate, so teams can form unintentionally. To get plain subagents, don't name them, or set the env var to `0`.
- **Interactive sessions only.** With `-p` / Agent SDK, no teammates spawn; named subagents run as ordinary subagents.
- Subagents and teammates share the same agent panel, so the panel alone does not prove a team formed.
- One team per session. The lead is fixed for the session's lifetime. Teammates cannot spawn teammates (no nesting).

---

## 3. Building an effective team — checklist

### Team size
- Start with **3–5 teammates**. No hard limit, but tokens scale linearly and coordination overhead grows.
- 15 independent tasks → 3 teammates is a good start.
- "Three focused teammates often outperform five scattered ones."

### Task sizing
- **Too small:** coordination overhead exceeds the benefit.
- **Too large:** long stretches without check-ins, more wasted effort.
- **Right:** a self-contained unit with a clear deliverable (a function, a test file, a review).
- Aim for **5–6 tasks per teammate** so nobody idles and work can be reassigned.

### Ownership
- **Never have two teammates edit the same file** — it causes overwrites. Partition by file set.
- Give roles that are independent and don't wait on each other.

### Spawn prompts (the most important lever)
Teammates load project context (CLAUDE.md, MCP servers, skills) but **do not inherit the lead's conversation history**. The spawn prompt is everything they know about the task. Include:

- Exact paths / scope (`src/auth/`)
- What to focus on
- Relevant facts not in the repo (e.g. "JWT tokens in httpOnly cookies")
- The expected deliverable and format (e.g. "report issues with severity ratings")
- **A name for each teammate**, so later prompts and messages can address them predictably

Example:

```
Spawn a security reviewer teammate with the prompt: "Review the authentication module
at src/auth/ for security vulnerabilities. Focus on token handling, session
management, and input validation. The app uses JWT tokens stored in
httpOnly cookies. Report any issues with severity ratings."
```

### Lead behavior
- The lead sometimes starts implementing instead of waiting. Counter: "Wait for your teammates to complete their tasks before proceeding."
- The lead can also declare the team finished too early — tell it to keep going.
- Monitor and steer; long unattended runs waste effort.
- New to teams → start with research/review tasks, not parallel implementation.

---

## 4. Proven prompt patterns

**Independent perspectives**
```
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Spawn three teammates to explore this from different angles:
one on UX, one on technical architecture, one playing devil's advocate.
```

**Parallel review with distinct lenses** (prevents one reviewer fixating on one issue type)
```
Spawn three teammates to review PR #142:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

**Competing hypotheses / adversarial debate** (fights anchoring)
```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific
debate. Update the findings doc with whatever consensus emerges.
```

**Fixed count and model**
```
Spawn 4 teammates to refactor these modules in parallel. Use Sonnet for
each teammate.
```

**Reusable role**
```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

---

## 5. Architecture

| Component | Role |
| --- | --- |
| Team lead | Main session; spawns teammates, coordinates, synthesizes |
| Teammates | Separate Claude Code instances |
| Task list | Shared work items teammates claim and complete |
| Mailbox | Messaging between agents |

Storage (team name = `session-` + first 8 chars of session ID):

| What | Path | Lifetime |
| --- | --- | --- |
| Team config | `~/.claude/teams/{team-name}/config.json` | Removed when session ends |
| Mailboxes | `~/.claude/teams/{team-name}/inboxes/{agent-name}.json` | With team dir |
| Task list | `~/.claude/tasks/{team-name}/` | Persists; governed by `cleanupPeriodDays` |

- **Do not hand-edit or pre-author the team config** — it holds runtime state and is overwritten.
- There is **no project-level team config**. `.claude/teams/teams.json` in a project is just a file. Reusable roles go in subagent definitions.
- `config.json` has a `members` array (name, agent ID, agent type; lead is `team-lead`). Teammates can read it to discover each other.
- A message counts as sent only if the write to the recipient's mailbox succeeds; otherwise the sender gets an error.

### Tasks
- States: **pending → in progress → completed**. Tasks can depend on others and show as **blocked**.
- Dependencies unblock automatically when prerequisites complete.
- **Lead assigns** or teammates **self-claim** the next unassigned, unblocked task. Teammates won't self-claim blocked tasks, but the lead can assign them.
- Claiming uses file locking, so no double-claims.
- Agents without the Task tools coordinate through messages only.

### Communication
- Messages deliver automatically; the lead does not poll.
- **Idle notification:** when a teammate stops, the lead is notified with its final answer (or the error text if it failed on an API error).
- Message by name. **No broadcast** — to reach everyone, send one message per recipient.
- Messages between agents are marked as coming from another Claude session, not the user. A teammate **cannot** approve a permission prompt, supply consent, or relay a denied action to another teammate to bypass a check.
- In auto mode the classifier reviews every inter-agent message and treats relayed approvals as untrusted.

---

## 6. Models and effort

Teammate model = first that applies:

1. Model named in the spawn prompt for that teammate
2. The subagent definition's `model` (`inherit` = lead's model)
3. `CLAUDE_CODE_SUBAGENT_MODEL` (if not `inherit`)
4. The lead's current model

- An installed mod's `agent.spawn` hook model overrides source 1.
- `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` (v2.1.257+) skips sources 1–2.
- `teammateDefaultModel` was removed in v2.1.234 — ignored. Name the model in the prompt.
- Org `availableModels` allowlist can substitute: a blocked family alias → newest permitted version of that family (Anthropic API / Claude Platform on AWS); anything else blocked → lead's model.
- A teammate on the lead's model inherits the lead's effort level.
- **Model and fast mode are fixed at spawn.** `/model` and `/fast` from a teammate view affect the lead, not the teammate.

---

## 7. Subagent definitions as teammate roles

Define a role once (project, user, managed, or plugin scope) and reuse it as subagent or teammate. What applies:

| Field | In-process teammate | Split-pane teammate |
| --- | --- | --- |
| `tools` | Applied; `SendMessage` + Task tools added | Applied |
| `model` | Applied if prompt names none | Same |
| `disallowedTools` | Applied (`SendMessage`/Task tools stay) | — |
| `effort` | Applied | — |
| `autoCompactWindow` (v2.1.296+) | Applied | Ignored |
| Body | **Appended** to default system prompt | **Replaces** default system prompt |
| `skills` | **Not applied** (loads from project/user settings) | Not applied |
| `mcpServers` | Ignored (loads from project/user settings) | Applied |

- Messaging a stopped in-process teammate revives it in the same session with its saved conversation. This does **not** happen after `/resume`.
- A revived teammate only gets its definition back if the folder holding the agent file is trusted (a trusted parent folder doesn't count); otherwise it returns with no definition tools/instructions.

---

## 8. Permissions

- **No per-teammate permission mode at spawn.** Teammates start in the lead's mode — including `bypassPermissions`. Exception: lead in `dontAsk` → teammate starts in Manual.
- Teammate permission prompts surface **in the lead session**.
- **Pre-approve common operations before spawning** to avoid a flood of prompts.
- In-process teammates run under the lead's live allow/deny rules (`--allowedTools`, `--disallowedTools`, `--tools` all apply).
- Split-pane teammates get `--disallowedTools` and `--tools` (v2.1.309+) but **not `--allowedTools`**. Use `claude --settings '{"permissions":{"allow":["Bash(npm *)"]}}'` instead.
- An in-process teammate not in plan mode follows the lead while the lead is in `acceptEdits`, `auto`, or `bypassPermissions` — switching the teammate to Manual does nothing until the lead is Manual too.
- `Shift+Tab` cycles a running teammate's mode (in its pane, or while viewing it in-process; takes effect next turn).

### Plan-before-implement
- Put the **lead in plan mode first**, then spawn — the teammate works in plan mode until its plan is ready.
- By default the plan is **auto-approved on arrival, without lead review**. Then the teammate takes the lead's current mode (or Manual if that is plan mode).
- To get an actual lead review, put the running in-process teammate into plan mode yourself with `Shift+Tab` while viewing it. The lead (not the user) approves or sends it back.

---

## 9. Quality gates (hooks)

| Hook | Fires when | Exit code 2 does |
| --- | --- | --- |
| `TeammateIdle` | Teammate is about to go idle | Sends feedback, keeps it working |
| `TaskCreated` | Task is being created | Blocks creation, sends feedback |
| `TaskCompleted` | Task is being marked complete | Blocks completion, sends feedback |

Use `TaskCompleted` to require passing tests/lint before a task can close.

---

## 10. Display modes and controls

`teammateMode` in `~/.claude/settings.json`, or `claude --teammate-mode <mode>` (experimental flag, not in `--help`):

| Mode | Behavior |
| --- | --- |
| `in-process` (default) | All teammates in the main terminal; works anywhere |
| `auto` | Split panes if already in tmux, or iTerm2 with `it2`; else in-process |
| `tmux` | Split panes; auto-detects tmux vs iTerm2 |
| `iterm2` | Native iTerm2 panes; requires `it2` CLI + Python API enabled |

Split panes are **not supported** in VS Code's integrated terminal, Windows Terminal, or Ghostty. `tmux -CC` in iTerm2 is the suggested entry point.

In-process keys (agent panel below the prompt):

| Key | Action |
| --- | --- |
| ↑ / ↓ | Select teammate |
| Enter | Open transcript and message it |
| Esc | Clear selection; while viewing, interrupts that teammate's turn |
| `x` | Stop selected teammate |
| Ctrl+T | Toggle task list |
| Shift+Tab | Cycle the viewed teammate's permission mode |

- While viewing a teammate: plain text and skills go to the teammate; built-in commands go to the lead. `/compact`, `/clear`, `/rewind` ask for confirmation.
- Idle rows hide 30s after the whole panel is idle; more than three idle rows collapse into `N idle agents`. Hidden ≠ stopped — message by name to bring it back.

Shutdown: "Ask the `<name>` teammate to shut down." The teammate may approve or reject with a reason. Team directories clean up automatically at session end.

---

## 11. Cost

- Token use scales with active teammates. Worth it for research, review, and new features; not for routine work.
- In-process teammates' prompt cache holds **5 minutes** by default. Set `subagentPromptCacheTtl` to `1h` to extend (1-hour cache writes bill at a higher rate).

---

## 12. Limitations

- **No resume:** `/resume` and `/rewind` don't restore in-process teammates. The lead may message ghosts — spawn new ones.
- **Task status lags:** teammates sometimes forget to mark tasks complete, blocking dependents. Verify and update manually or have the lead nudge.
- **Slow shutdown:** a teammate finishes its current request/tool call first.
- **One team per session**, no named extra teams, no sharing across sessions.
- **No nested teams.**
- **No background subagents from in-process teammates:** `background: true` definitions error; `run_in_background: true` errors or silently runs foreground.
- **Lead is fixed;** no promotion or transfer.

---

## 13. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Teammates not appearing | Check the agent panel; row may be hidden/collapsed, not stopped. Task may be too simple to warrant a team — ask explicitly for an agent team. For split panes: `which tmux`, or check `it2` + Python API. |
| Got subagents instead of a team | Ask again, explicitly requesting an agent team. |
| Got teammates instead of subagents | Set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` to `0`. Takes effect on save, no restart. Project/local/`--settings`/managed settings with `1` still win over user settings. |
| Too many permission prompts | Pre-approve in permission settings before spawning. |
| Teammate stopped after an error | Open its transcript; give instructions directly or spawn a replacement. Any message wakes a teammate waiting on an API retry. |
| Lead stops before work is done | Tell it to keep going. |
| Lead does the work itself | "Wait for your teammates to complete their tasks before proceeding." |
| Stuck/blocked task | Confirm the work is done, then update status manually or have the lead nudge. |
| Orphaned tmux session | `tmux ls` then `tmux kill-session -t <session-name>` |

---

## Related docs

- Subagents: <https://code.claude.com/docs/en/sub-agents>
- Cross-session messaging: <https://code.claude.com/docs/en/cross-session-messaging>
- Git worktrees: <https://code.claude.com/docs/en/worktrees>
- Hooks: <https://code.claude.com/docs/en/hooks>
- Agent team token costs: <https://code.claude.com/docs/en/costs#agent-team-token-costs>
