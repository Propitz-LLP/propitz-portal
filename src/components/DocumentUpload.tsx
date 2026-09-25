"use client";

import { useRef, useState } from "react";
import { CV_BUCKET, CV_MAX_BYTES, CV_TYPES } from "@/data/applications";
import { createClient } from "@/lib/supabase/client";
import { IconClose } from "@/components/Icon";

/* ------------------------------------------------------------------ */
/*  One document attached to an application.                           */
/*                                                                     */
/*  Shared by the careers form and the professional network form: a CV, */
/*  a cover letter, a company profile, a licence certificate. The file  */
/*  goes straight from the browser into the private cv-uploads bucket   */
/*  and only its path travels with the form.                            */
/* ------------------------------------------------------------------ */

const label = "mb-1.5 block text-sm font-medium text-ink";

export type Upload = ReturnType<typeof useUpload>;

/** Validate, upload to the private bucket, hold the path. */
export function useUpload() {
  const [file, setFile] = useState<{ path: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (chosen: File | undefined) => {
    if (!chosen) return;
    setError(null);

    if (chosen.size > CV_MAX_BYTES) {
      setError("That file is larger than 5 MB. Please attach a smaller one.");
      return;
    }
    if (!CV_TYPES.includes(chosen.type)) {
      setError("Please attach a PDF or Word document.");
      return;
    }

    setUploading(true);
    const ext = chosen.name.split(".").pop()?.toLowerCase() ?? "pdf";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await createClient()
      .storage.from(CV_BUCKET)
      .upload(path, chosen, { contentType: chosen.type, upsert: false });
    setUploading(false);

    if (uploadError) {
      setError(`Could not attach that file: ${uploadError.message}`);
      return;
    }
    setFile({ path, name: chosen.name });
  };

  return { file, uploading, error, pick, clear: () => setFile(null) };
}

export function FileField({
  id,
  label: text,
  hint,
  upload,
  name,
}: {
  id: string;
  label: string;
  hint: string;
  upload: Upload;
  name: string;
}) {
  // The ref lives here, with the input it belongs to.
  const input = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className={label} htmlFor={id}>
        {text} <span className="font-normal text-muted">({hint})</span>
      </label>
      {upload.file ? (
        <div className="flex items-center gap-3 rounded-xl bg-bg-alt px-4 py-3 text-sm">
          <span className="min-w-0 grow truncate font-medium text-ink">{upload.file.name}</span>
          <button
            type="button"
            onClick={() => {
              upload.clear();
              if (input.current) input.current.value = "";
            }}
            className="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand"
          >
            <IconClose size={13} />
            Remove
          </button>
        </div>
      ) : (
        <input
          ref={input}
          id={id}
          type="file"
          accept={CV_TYPES.join(",")}
          disabled={upload.uploading}
          aria-label={`${text} (${name})`}
          onChange={(e) => upload.pick(e.target.files?.[0])}
          className="block w-full text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark disabled:opacity-60"
        />
      )}
      {upload.uploading && <p className="mt-2 text-[13px] text-body">Attaching…</p>}
      {upload.error && <p className="mt-2 text-[13px] text-red-700">{upload.error}</p>}
    </div>
  );
}
