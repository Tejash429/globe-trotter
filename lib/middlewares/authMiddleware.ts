import { verifyToken, JwtPayload } from "../auth";

export function authenticateRequest(request: Request): JwtPayload | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}
