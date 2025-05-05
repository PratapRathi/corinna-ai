import { toast } from "sonner";
import { UserLoginProps, UserLoginSchema } from "@/schemas/auth.schema";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export const useSignInForm = () => {
  const { isLoaded, setActive, signIn } = useSignIn();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: "onChange",
  });
  const onHandleSubmit = methods.handleSubmit(async (values: UserLoginProps) => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const authenticated = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (authenticated.status === "complete") {
        await setActive({ session: authenticated.createdSessionId });
        toast.success("Success", {
          description: "Welcome back!",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        if (error.errors[0].code === "form_password_incorrect") {
          toast.error("Error", {
            description: "email/password is incorrect try again",
          });
        }
        else if (error.errors[0].code === "form_identifier_not_found") {
          toast.error("Error", {
            description: "You have not registered yet",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  });

  return {
    methods,
    onHandleSubmit,
    loading,
  };
};
