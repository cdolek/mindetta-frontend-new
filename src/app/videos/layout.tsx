import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import NavBar2 from "~/app/_components/NavBar2";
import { Flex, Container } from "@radix-ui/themes";

export default async function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <Flex direction="column">
      <NavBar2 session={session} />
      <Flex flexGrow="1" align="center" justify="center" direction="column">
        <Container>{children}</Container>
      </Flex>
      {/* <LoadingIndicator /> */}
    </Flex>
  );
}
