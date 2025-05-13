import { redirect } from "next/navigation";
import { onBoardUser } from "@/actions/user";

export default async function AuthCallback() {
  const { status, data, error } = await onBoardUser();
  
  if (status === 500 || error) {
    console.error("Error during user onboarding:", error);
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2">There was a problem setting up your account.</p>
          <a href="/sign-in" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white">
            Try Again
          </a>
        </div>
      </div>
    );
  }
  
  // User successfully created or already exists, redirect to dashboard
  redirect("/dashboard");
} 