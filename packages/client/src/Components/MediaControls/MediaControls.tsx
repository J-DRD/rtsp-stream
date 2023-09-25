// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

import React from "react";
import styled from "styled-components";
import {
  MuteButton,
  VolumeSlider,
  PlayButton,
  ResetButton,
} from "../../Components";

const Container = styled.div`
  transition: all 0.3s;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  inline-size: 18.75rem;
  padding: 0;
  position: fixed;
  z-index: 10000;
  inset-block-start: 0;
  inset-inline-start: calc(50% - 9.375rem);
  background-color: var(--xyz-black);
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0 0 0.1rem 0.1rem #000;
  opacity: 33%;
  border-block-start: none;

  :hover {
    opacity: 0.66;
  }
`;

Container.defaultProps = {
  className: "media-controls-container",
};

export interface MediaControlsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isPlaying: boolean;
  onPlay: () => void;
  isMuted: boolean;
  onMute: () => void;
  volume: number;
  onVolume: (volume: number | number[]) => void;
  onReset: () => void;
}

export const MediaControls: React.FunctionComponent<MediaControlsProps> = (
  props
) => {
  const { isPlaying, onPlay, isMuted, onMute, volume, onVolume, onReset } =
    props;

  return (
    <Container>
      <PlayButton isPlaying={isPlaying} onPlay={onPlay} />
      <MuteButton isMuted={isMuted} onMute={onMute} />
      <VolumeSlider volume={isMuted ? 0 : volume} onChange={onVolume} />
      <ResetButton onReset={onReset} />
    </Container>
  );
};

MediaControls.defaultProps = {
  className: "media-controls",
};
