# /spam Command Design

**Date:** 2026-06-28

## Summary

Add a `/spam` slash command that pings one or more Discord members once per second for a user-specified duration (1–60 seconds). Restricted to members with the `Regular` role.

## Command Signature

```
/spam member1:<user> [member2:<user>] [member3:<user>] [member4:<user>] seconds:<integer>
```

- `member1` — required USER option
- `member2`, `member3`, `member4` — optional USER options
- `seconds` — required INTEGER option, min 1, max 60

## Files

| File | Change |
|------|--------|
| `app/commands/spam.ts` | New file — command definition and execute logic |
| `app/commands/index.ts` | Add `spam` to the exports array |

## Execute Flow

1. Check that `interaction.member` has a role named `"Regular"`. If not, reply ephemerally: `"You need the Regular role to use this command."`
2. Collect `member1`–`member4` user options, filter out nulls, build a list of mentions (`<@id>`).
3. Reply ephemerally: `"Spamming [mentions] for X seconds."` to confirm the session started.
4. Cast `interaction.channel` to `Discord.TextChannel` and call `.send()` with the joined mention string every 1000ms via `setInterval`.
5. After `seconds * 1000`ms, call `clearInterval` — no further cleanup needed.

## Constraints

- Max duration: 60 seconds (enforced via Discord option `max_value: 60`)
- Min duration: 1 second (enforced via Discord option `min_value: 1`)
- Permission: `Regular` role check at runtime (by role name lookup on `interaction.member.roles`)
- No persistent state, no buttons, no DB interaction

## Patterns Followed

- Role check pattern: `(interaction.member.roles as Discord.GuildMemberRoleManager).cache.some(r => r.name === 'Regular')`
- Channel send pattern: matches `joke.ts` usage of `interaction.channel as Discord.TextChannel`
- Command registration: same standalone `ChatCommand` shape as `joke.ts` and `quote.ts`
