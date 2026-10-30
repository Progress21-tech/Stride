CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TUTOR', 'REVIEWER', 'ADMIN', 'SUPER_ADMIN');

CREATE TABLE "User" (
  "id" UUID NOT NULL,
  "email" VARCHAR(320) NOT NULL,
  "emailVerifiedAt" TIMESTAMPTZ(6),
  "passwordHash" VARCHAR(255),
  "name" VARCHAR(120) NOT NULL,
  "timeZone" VARCHAR(100) NOT NULL DEFAULT 'UTC',
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_lower_key" ON "User" (LOWER("email"));
CREATE INDEX "User_status_createdAt_idx" ON "User" ("status", "createdAt");

CREATE TABLE "OAuthAccount" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "provider" VARCHAR(40) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OAuthAccount_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OAuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "OAuthAccount_provider_providerAccountId_key" ON "OAuthAccount" ("provider", "providerAccountId");
CREATE INDEX "OAuthAccount_userId_idx" ON "OAuthAccount" ("userId");

CREATE TABLE "Session" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "tokenHash" VARCHAR(128) NOT NULL,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  "lastUsedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userAgent" VARCHAR(512),
  "ipHash" VARCHAR(128),
  "revokedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session" ("tokenHash");
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session" ("userId", "expiresAt");
CREATE INDEX "Session_expiresAt_idx" ON "Session" ("expiresAt");

CREATE TABLE "UserRole" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "role" "Role" NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "UserRole_userId_role_key" ON "UserRole" ("userId", "role");
CREATE INDEX "UserRole_role_idx" ON "UserRole" ("role");

CREATE TABLE "Invite" (
  "id" UUID NOT NULL,
  "email" VARCHAR(320) NOT NULL,
  "role" "Role" NOT NULL,
  "tokenHash" VARCHAR(128) NOT NULL,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  "usedAt" TIMESTAMPTZ(6),
  "createdById" UUID,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Invite_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Invite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Invite_tokenHash_key" ON "Invite" ("tokenHash");
CREATE INDEX "Invite_email_expiresAt_idx" ON "Invite" ("email", "expiresAt");

CREATE TABLE "VerificationToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
  "tokenHash" VARCHAR(128) NOT NULL,
  "purpose" VARCHAR(32) NOT NULL,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  "usedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
  );
CREATE UNIQUE INDEX "VerificationToken_tokenHash_key" ON "VerificationToken" ("tokenHash");
CREATE INDEX "VerificationToken_userId_purpose_expiresAt_idx" ON "VerificationToken" ("userId", "purpose", "expiresAt");

CREATE TABLE "AuditEvent" (
  "id" UUID NOT NULL,
  "actorId" UUID,
  "action" VARCHAR(100) NOT NULL,
  "objectType" VARCHAR(100) NOT NULL,
  "objectId" VARCHAR(128),
  "metadata" JSONB,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "AuditEvent_actorId_createdAt_idx" ON "AuditEvent" ("actorId", "createdAt");
CREATE INDEX "AuditEvent_objectType_objectId_createdAt_idx" ON "AuditEvent" ("objectType", "objectId", "createdAt");
CREATE INDEX "AuditEvent_action_createdAt_idx" ON "AuditEvent" ("action", "createdAt");

CREATE TABLE "FeatureFlag" (
  "key" VARCHAR(100) NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "Institution" (
  "id" UUID NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "slug" VARCHAR(200) NOT NULL,
  "country" CHAR(2) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Institution_slug_key" ON "Institution" ("slug");

CREATE TABLE "Faculty" (
  "id" UUID NOT NULL,
  "institutionId" UUID NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "slug" VARCHAR(200) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Faculty_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Faculty_institutionId_slug_key" ON "Faculty" ("institutionId", "slug");
CREATE INDEX "Faculty_institutionId_idx" ON "Faculty" ("institutionId");

CREATE TABLE "Department" (
  "id" UUID NOT NULL,
  "facultyId" UUID NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "slug" VARCHAR(200) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Department_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Department_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Department_facultyId_slug_key" ON "Department" ("facultyId", "slug");
CREATE INDEX "Department_facultyId_idx" ON "Department" ("facultyId");
