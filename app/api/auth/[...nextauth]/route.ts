import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createHash } from "crypto";

// SHA-256 hashed admin accounts
// Hash'leri şu şekilde üretebilirsiniz: echo -n "SifrenizBuraya" | shasum -a 256
const adminAccounts = [
  {
    username: process.env.ADMIN_USER_1 || "Alikarakoyun",
    passwordHash:
      process.env.ADMIN_PASSWORD_HASH_1 ||
      "e4afbb17d0445ddb636fea29af27d6573869d4873732f5932c5fb80828fa051f",
  },
  {
    username: process.env.ADMIN_USER_2 || "Furkankırbıyık",
    passwordHash:
      process.env.ADMIN_PASSWORD_HASH_2 ||
      "d67aa1b0d6cbd375dbd88a9379c8dbe12211437d01bee2e5881f1e332a1ac798",
  },
];

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Kullanıcı adı", type: "text" },
        password: { label: "Şifre", type: "password" },
        email: { label: "E-posta", type: "email" },
        firstName: { label: "Ad", type: "text" },
        lastName: { label: "Soyad", type: "text" },
        isAdmin: { label: "Admin", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Admin login flow: username + password with SHA-256 check
        if (credentials.username && credentials.password) {
          const account = adminAccounts.find(
            (item) => item.username === credentials.username
          );
          const passwordHash = createHash("sha256")
            .update(credentials.password)
            .digest("hex");
          if (!account || account.passwordHash !== passwordHash) return null;
          return {
            id: account.username,
            email: `${account.username}@kaswamakine.local`,
            name: account.username,
            isAdmin: true,
          };
        }

        // Regular user login flow (email-based, no server-side DB)
        if (credentials.email) {
          return {
            id: credentials.email,
            email: credentials.email,
            name:
              `${credentials.firstName || ""} ${credentials.lastName || ""}`.trim() ||
              credentials.email,
            isAdmin: credentials.isAdmin === "true",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (user) {
        token.isAdmin = (user as any).isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = token.provider;
        (session.user as any).isAdmin = token.isAdmin || false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
