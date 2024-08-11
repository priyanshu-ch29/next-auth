"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { credentialsLogin } from "@/actions/login";
import { redirect } from "next/navigation";

const LoginForm = () => {
  return (
    <form
      action={async (formData) => {
        const email = formData.get("Email") as string;
        const password = formData.get("Password") as string;

        if (!email || !password)
          return toast.error("Please provide all fields");

        const toastId = toast.loading("Logging in");

        const error = await credentialsLogin(email, password);

        if (!error) {
          toast.success("Login successfully", {
            id: toastId,
          });
          redirect("/");
        } else {
          toast.error(String(error), {
            id: toastId,
          });
        }
      }}
      className=" flex flex-col gap-4"
    >
      <Input placeholder="email" type="email" name="Email" />
      <Input placeholder="password" type="password" name="Password" />
      <Button type="submit">Login</Button>
    </form>
  );
};

export { LoginForm };
