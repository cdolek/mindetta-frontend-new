import Texty from "rc-texty";
import "rc-texty/assets/index.css";

const DummyTitle = ({ title }: { title: string }) => {
  const getSplit = (e: string) => {
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

  return (
    <Texty
      className="content"
      type="alpha"
      split={getSplit}
      // delay={2200}
      interval={30}
    >
      {title}
    </Texty>
  );
};

export default DummyTitle;
