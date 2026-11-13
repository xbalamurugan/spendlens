import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { suggestExpenseCategory } from "./ai/category-suggestion.server";
import { EXPENSE_CATEGORIES } from "./expense-categories";

type SuggestionResult = { category: string | null; error: string | null; status: number | null };

function getStatus(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const status = "statusCode" in error ? error.statusCode : "status" in error ? error.status : null;
  return typeof status === "number" ? status : null;
}

function getSafeProviderMessage(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("responseBody" in error)) return null;
  const body = error.responseBody;
  if (typeof body !== "string") return null;
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object") return null;
    const message = "message" in parsed ? parsed.message : null;
    return typeof message === "string" ? message : null;
  } catch {
    return null;
  }
}

export const suggestCategory = createServerFn({ method: "POST" })
  .inputValidator((input: { description: string }) => {
    if (typeof input?.description !== "string") throw new Error("Enter a transaction description first.");
    const description = input.description.trim();
    if (!description) throw new Error("Enter a transaction description first.");
    if (description.length > 200) throw new Error("Descriptions must be 200 characters or fewer.");
    return { description };
  })
  .handler(async ({ data }): Promise<SuggestionResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return {
        category: null,
        error: "Category suggestions are temporarily unavailable. Choose a category manually.",
        status: 401,
      };
    }

    try {
      const category = await suggestExpenseCategory(data.description, getRequest(), apiKey);
      return { category, error: null, status: null };
    } catch (error) {
      const status = getStatus(error);
      if (status === 499 || (error instanceof Error && error.name === "AbortError")) {
        return { category: null, error: "Suggestion stopped.", status: 499 };
      }
      const providerMessage = getSafeProviderMessage(error);
      const message =
        status === 401
          ? "Category suggestions are temporarily unavailable. Choose a category manually."
          : status === 402
            ? providerMessage ?? "AI credits are needed to suggest a category."
            : status === 403
              ? providerMessage ?? "Category suggestions aren't available right now."
              : status === 429
                ? "Too many suggestions were requested. Please try again shortly."
                : status !== null && status >= 500
                  ? "Category suggestions are temporarily unavailable. Please try again."
                  : providerMessage ?? "Couldn't suggest a category. Choose one manually or try again.";
      return { category: null, error: message, status };
    }
  });

export { EXPENSE_CATEGORIES };