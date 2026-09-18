export const encounterKeys = {
  all: ["encounters"] as const,
  lists: () => [...encounterKeys.all, "list"] as const,
  activeList: () => [...encounterKeys.lists(), "active"] as const,
  detail: (id: string) => [...encounterKeys.all, "detail", id] as const,
};
