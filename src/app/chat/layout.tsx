import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import NavBar2 from "~/app/_components/NavBar2";
import { Flex } from "@radix-ui/themes";

export default async function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <Flex direction="column" height="100%" style={{ height: "100vh" }}>
      <NavBar2 session={session} />
      <Flex
        flexGrow="1"
        style={{ background: "#0A0A0A" }}
        align="center"
        justify="center"
      >
        {children}
      </Flex>
      {/* <LoadingIndicator /> */}
    </Flex>
  );
}
