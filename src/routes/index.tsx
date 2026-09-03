import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/AuthCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpendLens — Log in to your expense tracker" },
      {
        name: "description",
        content:
          "Log in or create a SpendLens account to track expenses, spot spending patterns and hit your savings goals.",
      },
      { property: "og:title", content: "SpendLens — Log in to your expense tracker" },
      {
        property: "og:description",
        content: "Track expenses, spot spending patterns and hit your savings goals.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <h1 className="wordmark mb-8 text-4xl">SpendLens</h1>
      <AuthCard />
    </main>
  );
}
