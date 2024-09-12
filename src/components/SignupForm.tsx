"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// Define the schema with zod
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  imageUrl: z.string().url("Invalid URL").optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);

    // Call the createUser mutation via GraphQL
    const response = await fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            createUser(email: "${data.email}", name: "${data.name}", password: "${data.password}", imageUrl: "${data.imageUrl}") {
              id
              email
              name
            }
          }
        `,
      }),
    });
    const result = await response.json();
    setLoading(false);

    if (result.errors) {
      alert("Error creating account");
    } else {
      alert("Account created! You can now log in.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input type="email" {...register("email")} className="text-black" />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Name</label>
          <input type="text" {...register("name")} className="text-black" />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            className="text-black"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label>Profile Image URL (optional)</label>
          <input type="url" {...register("imageUrl")} className="text-black" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
