/** The entry shape stays generic until the owner answers D2 about collected fields. */
export interface WaitlistRepository<TEntry, TExport = TEntry> {
  add(entry: TEntry): Promise<void>;
  findByEmail(normalizedEmail: string): Promise<TEntry | null>;
  count(): Promise<number>;
  exportBatch(cursor?: string): Promise<{ entries: TExport[]; nextCursor?: string }>;
}
