import React, { useEffect, useState } from "react";
import { getSlides } from "./differ";
import { useSpring } from "react-use";
import Slide from "./slide";

function CommitInfo({ commit, move, onClick }) {
  const message = commit.message.split("\n")[0].slice(0, 80);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: `translateX(-50%) translateX(${250 * move}px)`,
        opacity: 1 / (1 + Math.min(0.8, Math.abs(move))),
        height: "50px",
        minWidth: "200px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <img
        src={commit.author.avatar}
        height={40}
        width={40}
        style={{ borderRadius: "4px" }}
      />
      <div style={{ paddingLeft: "6px" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>
          {commit.author.login}
        </div>
        <div style={{ fontSize: "0.85rem", opacity: "0.9" }}>
          on {commit.date.toDateString()}
        </div>
      </div>
      {/* <div title={commit.message}>
        {message}
        {message !== commit.message ? "..." : ""}
      </div> */}
    </div>
  );
}

function CommitList({ commits, currentIndex, selectCommit }) {
  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        height: "50px",
        position: "relative"
      }}
    >
      {commits.map((commit, commitIndex) => (
        <CommitInfo
          commit={commit}
          move={commitIndex - currentIndex}
          key={commitIndex}
          onClick={() => selectCommit(commitIndex)}
        />
      ))}
    </div>
  );
}

export default function History({ commits, language }) {
  const codes = commits.map(commit => commit.content);
  const slideLines = getSlides(codes);
  const [current, target, setTarget] = useSliderSpring(codes.length - 1);
  const index = Math.round(current);

  const nextSlide = () =>
    setTarget(Math.min(Math.round(target + 0.51), slideLines.length - 1));
  const prevSlide = () => setTarget(Math.max(Math.round(target - 0.51), 0));
  useEffect(() => {
    document.body.onkeydown = function(e) {
      if (e.keyCode === 39) {
        nextSlide();
      } else if (e.keyCode === 37) {
        prevSlide();
      } else if (e.keyCode === 32) {
        setTarget(current);
      }
    };
  });
  return (
    <React.Fragment>
      <CommitList
        commits={commits}
        currentIndex={current}
        selectCommit={index => setTarget(index)}
      />
      <Slide time={current - index} lines={slideLines[index]} />
    </React.Fragment>
  );
}
function useSliderSpring(initial) {
  const [target, setTarget] = useState(initial);
  const tension = 0;
  const friction = 10;
  const value = useSpring(target, tension, friction);

  return [Math.round(value * 100) / 100, target, setTarget];
}
