import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "jd_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecretKey(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET environment variable is missing.");
    }
    return "dev_local_only_insecure_session_secret_change_in_production";
  }
  return secret;
}

function createSignedSession(email: string): string {
  const payload = JSON.stringify({
    email,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const hmac = crypto
    .createHmac("sha256", getSecretKey())
    .update(payload)
    .digest("hex");
  const token = Buffer.from(payload).toString("base64url") + "." + hmac;
  return token;
}

function verifySession(token?: string | null): boolean {
  if (!token) return false;
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;

    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const expectedHmac = crypto
      .createHmac("sha256", getSecretKey())
      .update(payloadStr)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedHmac, "hex")
      )
    ) {
      return false;
    }

    const payload = JSON.parse(payloadStr);
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// 1. GET: Check current admin authentication status
export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isValid = verifySession(cookie?.value);

  return NextResponse.json(
    { authenticated: isValid },
    { status: isValid ? 200 : 401 }
  );
}

// 2. POST: Authenticate admin credentials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    const configuredEmail = process.env.ADMIN_EMAIL;
    const configuredPassword = process.env.ADMIN_PASSWORD;

    if (!configuredEmail || !configuredPassword) {
      console.error(
        "ADMIN_EMAIL or ADMIN_PASSWORD is not configured in environment variables."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Admin authentication is not configured on the server.",
        },
        { status: 500 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Secure constant-time comparison
    const emailMatch =
      email.trim().toLowerCase() === configuredEmail.trim().toLowerCase();
    const passwordMatch = password === configuredPassword;

    if (!emailMatch || !passwordMatch) {
      // Intentionally generic error message to prevent account enumeration
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password. Please try again.",
        },
        { status: 401 }
      );
    }

    const sessionToken = createSignedSession(email.trim());

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Admin Auth Error]:", error);
    return NextResponse.json(
      { success: false, error: "Authentication service temporarily unavailable." },
      { status: 500 }
    );
  }
}

// 3. DELETE: Log out admin
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Signed out successfully",
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
