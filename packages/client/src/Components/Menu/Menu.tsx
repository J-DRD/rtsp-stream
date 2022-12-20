// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const StickyIcon = styled.div`
  z-index: 2147483647;
  position: fixed;
  inset-block-end: 0;
  inset-inline-start: 0;
  inline-size: 2.625rem;
  display: flex;
  flex-direction: column;
  pointer-events: none;
`;

StickyIcon.defaultProps = {
  className: "sticky-icon",
};

const Slider = styled.div`
  transition: all 0.3s;
  border-radius: 0 3.125rem 3.125rem 0;
  text-align: start;
  margin: 0;
  text-decoration: none;
  text-transform: uppercase;
  padding: 0.3125rem;
  font-size: 1.875rem;
  line-height: 2rem;
  vertical-align: middle;
  color: #222;
  opacity: 0.7;
  background-color: #fdbb30;
  background: linear-gradient(0deg, #fdbb30, #ffe682);
  display: flex;
  pointer-events: all;
  cursor: pointer;
  transition-delay: 200ms;

  i {
    transition: all 0.3s;
    background-color: #fff;
    block-size: 2rem;
    inline-size: 2rem;
    color: #ccc;
    text-align: center;
    line-height: 2rem;
    border-radius: 50%;
    margin: 0 auto;
    background-size: 1.25rem;
    background-repeat: no-repeat;
    background-position: center;
  }

  :hover {
    transition-delay: 0ms;
    opacity: 1;
    i {
      transform: rotate(360deg);
    }
  }

  [data-active="true"] {
    opacity: 1;

    i {
      transform: rotate(360deg);
    }
  }
`;

Slider.defaultProps = {
  className: "slider",
};

const FancyIcon = styled.i`
  all: unset;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cdefs%3E%3Cstyle%3E.icon-canvas-transparent,.icon-vs-out%7Bfill:%23000000;%7D.icon-canvas-transparent%7Bopacity:0;%7D.icon-vs-bg%7Bfill:%23000000;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Econfigure%3C/title%3E%3Cg id='canvas'%3E%3Cpath class='icon-canvas-transparent' d='M16,0V16H0V0Z'/%3E%3C/g%3E%3Cg id='outline' style='display: none;'%3E%3Cpath class='icon-vs-out' d='M16,10.015l-2.238.372,1.318,1.847L12.233,15.08l-1.847-1.318L10.013,16H5.986l-.373-2.237L3.767,15.08.919,12.233l1.319-1.847L0,10.013V5.986l2.238-.373L.919,3.767,3.768.919,5.613,2.238,5.986,0h4.028l.372,2.238L12.233.919,15.08,3.768,13.762,5.613,16,5.986Z'/%3E%3C/g%3E%3Cg id='iconBg'%3E%3Cpath class='icon-vs-bg' d='M12.876,9.521,15,9.167V6.834L12.879,6.48a5.12,5.12,0,0,0-.354-.854l1.25-1.75-1.65-1.65L10.373,3.477c-.137-.072-.262-.159-.408-.219s-.3-.087-.444-.133L9.167,1H6.834L6.48,3.121a5.118,5.118,0,0,0-.854.354l-1.75-1.25-1.65,1.65L3.477,5.627c-.072.137-.159.262-.219.408s-.087.3-.133.444L1,6.833V9.166l2.121.354a5.122,5.122,0,0,0,.354.854l-1.25,1.75,1.65,1.65,1.752-1.252c.137.072.262.159.408.22s.3.087.444.133L6.833,15H9.166l.354-2.121a5.121,5.121,0,0,0,.854-.354l1.75,1.25,1.65-1.65-1.252-1.752c.072-.137.159-.263.219-.409S12.83,9.669,12.876,9.521ZM8,10.212A2.212,2.212,0,1,1,10.212,8,2.212,2.212,0,0,1,8,10.212Z'/%3E%3C/g%3E%3C/svg%3E");
`;

FancyIcon.defaultProps = {
  className: "fancy-icon",
};

export const Menu: React.FunctionComponent<MenuProps> = (_props) => {
  //drag active state
  const [active, setActive] = useState(false);

  // current x and y position
  const [pos, setPos] = useState({ x: 0, y: -100 });

  const onWindowClick = (event: Event) => {
    console.log("window click", event);
    // setActive(false);
  };

  // Start drag handler
  const onStart = (e: DraggableEvent, data: DraggableData) => {
    console.log("start drag", data);
  };

  // Stop drag handler
  const onStop = (e: DraggableEvent, data: DraggableData) => {
    console.log("stop drag", data);
    const { y } = data;
    setPos({ x: 0, y });
  };

  // Fancy Icon click handler
  const onSliderClick = () => {
    console.log("fancy icon click");
    setActive(!active);
  };

  useEffect(() => {
    // window.addEventListener("resize", onWindowResize);
    window.addEventListener("click", onWindowClick);

    return () => {
      // window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  return (
    <Draggable
      axis="y"
      disabled={active}
      onStart={onStart}
      onStop={onStop}
      position={pos}
      grid={[10, 10]}
      bounds="parent"
    >
      <StickyIcon>
        <Slider
          role={"button"}
          onClick={onSliderClick}
          data-position={pos}
          data-active={active}
        >
          <FancyIcon />
        </Slider>
      </StickyIcon>
    </Draggable>
  );
};
