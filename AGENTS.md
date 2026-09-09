<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Client demo artifacts

Demos published for a client (the WhatsApp mockups in `demos/`) are shared as private
links, so they need an end date or they circulate indefinitely.

**Default: expire two days after publication.** When you publish one, schedule a one-off
task for two days out that republishes the same artifact URL with a short "This demo has
expired" page. Same URL, so the link is replaced rather than left live.

Two limits worth knowing before you promise otherwise: a session cannot delete an artifact
or switch off its link sharing — both are manual, from the gallery at
claude.ai/code/artifacts — and artifacts have no built-in expiry or view cap, which is why
the scheduled republish exists.
