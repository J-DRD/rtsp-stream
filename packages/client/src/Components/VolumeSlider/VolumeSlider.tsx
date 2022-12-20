// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React from "react";
import Slider, { SliderProps } from "rc-slider";
import styled from "styled-components";
import "rc-slider/assets/index.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  inline-size: 8rem;
  padding: 0.5rem;

  .rc-slider-track {
    background-color: var(--xyz-yellow04);
  }
  .rc-slider-handle {
    border-color: var(--xyz-yellow04);
  }

  &&
    .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
    box-shadow: 0 0 0.3125rem var(--xyz-yellow04);
    border-color: var(--xyz-yellow04);
  }
`;

Container.defaultProps = {
  className: "volume-slider-container",
};

// Volume slider types.
export interface VolumeSliderProps extends SliderProps {
  volume: number;
}

export const VolumeSlider: React.FunctionComponent<VolumeSliderProps> = (
  props
) => {
  const { volume, onChange, min = 0, max = 100 } = props;

  return (
    <Container>
      <Slider
        className="volume-slider"
        min={min}
        max={max}
        step={1}
        value={volume}
        onChange={onChange}
      />
    </Container>
  );
};

VolumeSlider.defaultProps = {
  className: "volume-slider",
  volume: 0,
  onChange: undefined,
  min: 0,
  max: 100,
  step: 1,
};
