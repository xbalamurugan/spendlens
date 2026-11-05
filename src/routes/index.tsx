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
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-16 pt-[12vh]">
      <div className="flex w-full max-w-[400px] flex-col">
        <h1 className="wordmark mb-6 text-4xl">SpendSense</h1>
        <AuthCard />
      </div>
    </main>
  );
}
