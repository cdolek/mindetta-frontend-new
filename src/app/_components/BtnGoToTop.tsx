import React from "react";
import { Button } from "@radix-ui/themes";

const BtnGoToTop: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button onClick={scrollToTop} style={{ marginTop: "20px" }} variant="ghost">
      Go to top
    </Button>
  );
};

export default BtnGoToTop;
