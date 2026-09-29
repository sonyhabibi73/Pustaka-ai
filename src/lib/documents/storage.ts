import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

const BUCKET = "study-materials";

function storage() {
  const env = getServerEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export async function uploadPrivateFile(key: string, buffer: Buffer, mimeType: string) {
  const { error } = await storage()
    .storage.from(BUCKET)
    .upload(key, buffer, { contentType: mimeType, upsert: false });
  if (error) throw new Error("STORAGE_UPLOAD_FAILED");
}

export async function downloadPrivateFile(key: string) {
  const { data, error } = await storage().storage.from(BUCKET).download(key);
  if (error || !data) throw new Error("STORAGE_DOWNLOAD_FAILED");
  return Buffer.from(await data.arrayBuffer());
}
