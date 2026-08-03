export type Issue = {
  message: string;
  path?: PropertyKey[];
};

export function formatPath(path: readonly PropertyKey[]): string {
  let result = "";

  for (const segment of path) {
    if (typeof segment === "number") {
      result += `[${segment}]`;
    } else if (
      typeof segment === "string" &&
      /^[A-Za-z_$][\w$]*$/.test(segment)
    ) {
      result += result ? `.${segment}` : segment;
    } else {
      result += `[${JSON.stringify(segment)}]`;
    }
  }

  return result;
}

export function formatIssue(issue: Issue) {
  const path = formatPath(issue.path ?? []);
  return path ? `${path}: ${issue.message}` : issue.message;
}

export function formatValidationMessage(issues: readonly Issue[]): string {
  if (issues.length === 0) {
    return "Validation failed";
  }

  if (issues.length === 1) {
    return `Validation failed: ${formatIssue(issues[0]!)}`;
  }

  const details = issues.map((issue) => `  - ${formatIssue(issue)}`).join("\n");

  return `Validation failed with ${issues.length} issues:\n${details}`;
}
