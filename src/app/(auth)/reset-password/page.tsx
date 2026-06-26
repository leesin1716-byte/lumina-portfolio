import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "새 비밀번호" };

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
