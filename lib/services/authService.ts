import { prisma } from "../prisma";
import { hashPassword, comparePassword, generateToken } from "../auth";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  updateProfileSchema,
  SignupInput,
  LoginInput,
  ForgotPasswordInput,
  UpdateProfileInput,
} from "../validations/auth";

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
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
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

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const validatedData = updateProfileSchema.parse(input);

    const updatePayload: any = {};
    if (validatedData.firstName !== undefined) updatePayload.firstName = validatedData.firstName.trim();
    if (validatedData.lastName !== undefined) updatePayload.lastName = validatedData.lastName.trim();

    // Auto-update full name if firstName or lastName or name is provided
    if (validatedData.name) {
      updatePayload.name = validatedData.name.trim();
    } else if (validatedData.firstName || validatedData.lastName) {
      const existing = await prisma.user.findUnique({ where: { id: userId } });
      const fName = validatedData.firstName !== undefined ? validatedData.firstName : existing?.firstName || "";
      const lName = validatedData.lastName !== undefined ? validatedData.lastName : existing?.lastName || "";
      updatePayload.name = `${fName} ${lName}`.trim();
    }

    if (validatedData.phoneNumber !== undefined) updatePayload.phoneNumber = validatedData.phoneNumber.trim();
    if (validatedData.country !== undefined) updatePayload.country = validatedData.country.trim();
    if (validatedData.city !== undefined) updatePayload.city = validatedData.city.trim();
    if (validatedData.additionalInfo !== undefined) updatePayload.additionalInfo = validatedData.additionalInfo.trim();
    if (validatedData.language !== undefined) updatePayload.language = validatedData.language;
    if (validatedData.avatarUrl !== undefined) updatePayload.avatarUrl = validatedData.avatarUrl;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
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

    return user;
  }
}
