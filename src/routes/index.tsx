import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/AuthCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpendSense — Log in to your expense tracker" },
      {
        name: "description",
        content:
          "Log in or create a SpendSense account to track expenses, spot spending patterns and hit your savings goals.",
      },
      { property: "og:title", content: "SpendSense — Log in to your expense tracker" },
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
      <h1 className="wordmark mb-8 text-4xl">SpendSense</h1>
      <AuthCard />
    </main>
  );
}
