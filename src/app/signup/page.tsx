import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CredentialsSignin } from "next-auth";
import { User } from "@/models/userModel";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/utils";

const Page = () => {
  const handleSignUp = async (formData: FormData) => {
    "use server";

    const name = formData.get("Name") as string | undefined;
    const password = formData.get("Password") as string | undefined;
    const email = formData.get("Email") as string | undefined;

    if (!name || !email || !password)
      throw new CredentialsSignin({
        cause: "Please provide all fields",
      });

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (user) throw new CredentialsSignin({ cause: "User already exists" });

    const hashPassword = await hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPassword,
    });

    redirect("/login");
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSignUp} className=" flex flex-col gap-4">
            <Input placeholder="name" type="text" name="Name" />
            <Input placeholder="email" type="email" name="Email" />
            <Input placeholder="password" type="password" name="Password" />
            <Button type="submit">Sign up</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span>Or</span>
          <form action="">
            <Button type="submit" variant={"outline"}>
              Login with Google
            </Button>
          </form>
          <Link href="/login">Already have an account? Login in</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
