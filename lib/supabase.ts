import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    url,
    anonKey,
    serviceRoleKey,
    configured: Boolean(url && anonKey)
  };
}

export function createSupabaseBrowser() {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    throw new Error("Supabase browser client is not configured.");
  }

  return createBrowserClient(url, anonKey);
}

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    throw new Error("Supabase server client is not configured.");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set(name, "", { ...options, maxAge: 0 });
      }
    }
  });
}

/**
 * 어드민 전용 클라이언트 (서버 사이드 전용)
 * RLS(보안 정책)를 우회하여 모든 데이터를 조작할 수 있습니다.
 * 반드시 서버 컴포넌트나 API 라우트에서만 사용하세요.
 */
export async function createSupabaseAdmin() {
  const { url, serviceRoleKey } = getSupabaseConfig();

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  // Admin client doesn't need cookie handling as it bypasses RLS
  return createServerClient(url, serviceRoleKey, {
    cookies: {
      get: () => undefined,
      set: () => {},
      remove: () => {}
    }
  });
}

export function isSupabaseConfigured() {
  return getSupabaseConfig().configured;
}

