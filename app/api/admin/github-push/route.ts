import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function runGit(args: string[]) {
  const { stdout, stderr } = await execFileAsync("git", args, {
    cwd: process.cwd(),
    windowsHide: true,
    maxBuffer: 1024 * 1024 * 4,
  });

  return {
    stdout: (stdout ?? "").toString().trim(),
    stderr: (stderr ?? "").toString().trim(),
  };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";
  const expectedToken = process.env.ADMIN_PUSH_TOKEN ?? "";

  if (!expectedToken) {
    return json(
      { error: "ADMIN_PUSH_TOKEN is not configured on server." },
      500
    );
  }

  if (!token || token !== expectedToken) {
    return json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      message?: string;
    };
    const commitMessage =
      body.message?.trim() || `chore: admin push ${new Date().toISOString()}`;

    try {
      const repoCheck = await runGit(["rev-parse", "--is-inside-work-tree"]);
      if (repoCheck.stdout !== "true") {
        return json({ error: "Current directory is not a git repository." }, 400);
      }
    } catch {
      return json({ error: "Git repository was not found." }, 400);
    }

    const branchInfo = await runGit(["rev-parse", "--abbrev-ref", "HEAD"]);
    const branch = branchInfo.stdout || "main";

    const statusBefore = await runGit(["status", "--porcelain"]);
    if (!statusBefore.stdout) {
      return json({
        ok: true,
        noChanges: true,
        branch,
        message: "No local changes to commit.",
      });
    }

    await runGit(["add", "-A"]);
    await runGit(["commit", "-m", commitMessage]);
    const commitHashInfo = await runGit(["rev-parse", "--short", "HEAD"]);
    await runGit(["push", "origin", branch]);

    return json({
      ok: true,
      noChanges: false,
      branch,
      commitHash: commitHashInfo.stdout,
      message: "Pushed successfully.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: `Push failed: ${message}` }, 500);
  }
}

