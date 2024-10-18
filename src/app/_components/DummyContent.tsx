import Texty from "rc-texty";

export const getSplit = (e: string) => {
  const t = e.split(" ");
  const c: unknown[] = [];
  t.forEach((str: string, i) => {
    c.push(<span key={`${str}-${i}`}>{str}</span>);
    if (i < t.length - 1) {
      c.push(<span key={` -${i}`}> </span>);
    }
  });
  return c as string[];
};

const DummyContent = () => {
  return (
    <Texty
      className="content"
      type="alpha"
      split={getSplit}
      delay={1200}
      interval={8}
    >
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem libero
      aliquid consectetur, dignissimos quis alias. Alias, at. Quam, expedita
      alias hic minima suscipit voluptatibus perferendis quos quis at fugit
      nulla?
    </Texty>
  );
};

export default DummyContent;
