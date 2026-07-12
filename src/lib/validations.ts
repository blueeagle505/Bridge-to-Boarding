import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[a-z]/, "Include at least one lowercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[a-z]/, "Include at least one lowercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

export const applicationSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email(),
  currentSchool: z.string().trim().min(1, "Current school is required").max(160),
  state: z.string().trim().min(2, "State is required").max(56),
  currentGrade: z.enum(["GRADE_7", "GRADE_8"], { required_error: "Select your current grade" }),
  gpa: z.string().trim().min(1, "GPA is required").max(10),
  helpNeeded: z
    .string()
    .trim()
    .min(30, "Please share at least a few sentences so mentors understand how to help")
    .max(4000),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms to submit your application" }),
  }),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const mentorApplicationSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().toLowerCase().email(),
  school: z.string().trim().min(1).max(160),
  graduationYear: z.coerce.number().int().min(new Date().getFullYear()).max(new Date().getFullYear() + 8),
  currentGrade: z.string().trim().min(1).max(40),
  activities: z.string().trim().min(1).max(2000),
  leadership: z.string().trim().min(1).max(2000),
  expertise: z.array(z.string()).min(1, "Select at least one area you can mentor in"),
  availability: z.string().trim().min(1).max(500),
  motivation: z.string().trim().min(30, "Tell us a bit more about why you want to mentor").max(3000),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms to apply" }),
  }),
});
export type MentorApplicationInput = z.infer<typeof mentorApplicationSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().toLowerCase().email(),
  message: z.string().trim().min(10).max(2000),
});

export const adminApplicationActionSchema = z.object({
  action: z.enum(["APPROVE", "WAITLIST", "REJECT", "ASSIGN_MENTOR", "ADD_NOTE", "SET_STATUS"]),
  mentorId: z.string().optional(),
  note: z.string().max(4000).optional(),
  status: z
    .enum(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "MENTOR_ASSIGNED", "WAITLISTED", "REJECTED", "CLOSED"])
    .optional(),
});

export const createAdminSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(10),
});
