import { prisma } from "../prisma";
import { hashPassword, comparePassword, generateToken } from "../auth";
import { signupSchema, loginSchema, forgotPasswordSchema, SignupInput, LoginInput, ForgotPasswordInput } from "../validations/auth";

export class AuthService {
  static async signup(input: SignupInput) {
    const validatedData = signupSchema.parse(input);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      const error: any = new Error("An account with this email already exists");
      error.statusCode = 400;
      error.code = "EMAIL_ALREADY_EXISTS";
      throw error;
    }

    const passwordHash = await hashPassword(validatedData.password);
    const fullName = `${validatedData.firstName} ${validatedData.lastName}`.trim();

    const user = await prisma.user.create({
      data: {
        name: fullName,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email.toLowerCase(),
        passwordHash,
        phoneNumber: validatedData.phoneNumber,
        country: validatedData.country,
        city: validatedData.city,
        additionalInfo: validatedData.additionalInfo,
        role: "USER",
        language: "en",
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        country: true,
        city: true,
        additionalInfo: true,
        avatarUrl: true,
        language: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  static async login(input: LoginInput) {
    const validatedData = loginSchema.parse(input);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const isPasswordValid = await comparePassword(validatedData.password, user.passwordHash);

    if (!isPasswordValid) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  static async forgotPassword(input: ForgotPasswordInput) {
    const validatedData = forgotPasswordSchema.parse(input);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (user) {
      console.log(`[AUTH] Password reset requested for user: ${user.email} (${user.id})`);
    }

    return {
      message: "If an account with that email exists, password reset instructions have been sent.",
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        country: true,
        city: true,
        additionalInfo: true,
        avatarUrl: true,
        language: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            trips: true,
            savedDestinations: true,
          },
        },
      },
    });

    if (!user) {
      const error: any = new Error("User profile not found");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    return user;
  }
}
