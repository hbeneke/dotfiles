# SSH Agent Activation

Start the SSH agent and load the GitHub SSH key so that git remote operations (push, pull, fetch, clone) work in this session.

## Instructions

1. Run `eval $(ssh-agent -s)` to start the SSH agent in the current shell
2. Run `ssh-add ~/.ssh/github` to load the key
3. Verify with `ssh -T git@github.com` — expected output contains "successfully authenticated"
4. Confirm to the user that SSH is active and git remote operations are ready

## Important

- This must be done in a **single Bash call** chaining the commands, because shell state does not persist between calls
- If the key requires a passphrase and fails, inform the user they need to enter it manually
- This only lasts for the current session — it needs to be run again in new sessions
