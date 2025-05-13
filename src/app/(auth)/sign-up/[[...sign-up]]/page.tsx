import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignUp
        afterSignUpUrl="/auth-callback"
        redirectUrl="/auth-callback"
      />
    </div>
  );
}
