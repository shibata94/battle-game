export const createJobUrl = (job: string): string => {
  const params = new URLSearchParams({ job });
  return `/selectStage?${params.toString()}`;
}

