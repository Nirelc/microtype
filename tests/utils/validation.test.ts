import { describe, expect, test } from "bun:test";

import {
  formatPath,
  formatIssue,
  formatValidationMessage,
} from "../../src/utils/validation";

describe("validation", () => {
  test("formatPath", () => {
    expect(formatPath([])).toBe("");
    expect(formatPath([0])).toBe("[0]");
    expect(formatPath(["test"])).toBe("test");
    expect(formatPath([0, "test"])).toBe("[0].test");
    expect(formatPath([0, "test", "test-data"])).toBe('[0].test["test-data"]');
  });

  test("formatIssue", () => {
    const message = "Expected number";
    expect(
      formatIssue({
        message,
      }),
    ).toBe(message);
    expect(
      formatIssue({
        message,
        path: [0],
      }),
    ).toBe("[0]: Expected number");
  });

  test("formatValidationMessage", () => {
    const message = "Expected number";
    expect(formatValidationMessage([])).toBe("Validation failed");
    expect(
      formatValidationMessage([
        {
          message,
        },
      ]),
    ).toBe(`Validation failed: ${message}`);

    const issuesWithoutPath = [
      {
        message,
      },
      {
        message: "Expected string",
      },
    ];

    const issuesWithPath = issuesWithoutPath.map((issue) => ({
      ...issue,
      path: [0, crypto.randomUUID()],
    }));
    const issuesMessageWithoutPath = issuesWithoutPath
      .map((issue) => `  - ${formatIssue(issue)}`)
      .join("\n");
    const issuesMessageWithPath = issuesWithPath
      .map((issue) => `  - ${formatIssue(issue)}`)
      .join("\n");
    expect(formatValidationMessage(issuesWithoutPath)).toBe(
      `Validation failed with 2 issues:\n${issuesMessageWithoutPath}`,
    );
    expect(formatValidationMessage(issuesWithPath)).toBe(
      `Validation failed with 2 issues:\n${issuesMessageWithPath}`,
    );
  });
});
