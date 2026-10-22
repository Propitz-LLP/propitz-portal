import { expect } from "@playwright/test";
import { admin } from "./admin";

/**
 * The newest row where `column = value`, waiting briefly for it to land.
 * With `expectNone`, waits a moment and returns null if none appeared.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function findRow(table: string, column: string, value: string, opts: { expectNone?: boolean } = {}): Promise<any> {
  const read = async () => {
    const { data, error } = await admin()
      .from(table)
      .select("*")
      .eq(column, value)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw new Error(`${table}: ${error.message}`);
    return data?.[0] ?? null;
  };

  if (opts.expectNone) {
    await new Promise((r) => setTimeout(r, 2000));
    return read();
  }

  let row = null;
  await expect.poll(async () => (row = await read()), { timeout: 10_000, message: `${table}.${column} = ${value}` }).not.toBeNull();
  return row;
}
