// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React from "react";
import styled from "styled-components";
import { MediaControls, Player } from "../Components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

Container.defaultProps = {
  className: "app-container",
};

export const App: React.FunctionComponent = () => {
  // Playing state.
  const [isPlaying, setIsPlaying] = React.useState(true);

  // Mute state.
  const [isMuted, setIsMuted] = React.useState(false);

  // Volume state.
  const [volume, setVolume] = React.useState(100);

  // Reset state.
  const [reset, setReset] = React.useState(false);

  const getAllVideoElements = () => {
    return document.querySelectorAll("video");
  };

  // Mute all videos.
  const onMute = (mute: boolean) => {
    setIsMuted(mute);
    // get all video elements.
    getAllVideoElements().forEach((video: HTMLVideoElement) => {
      // mute video.
      video.volume = mute ? 0 : volume / 100;
    });
  };

  const onVolume = (value: number | number[]) => {
    if (typeof value !== "number") {
      return;
    }

    setVolume(value);
    setIsMuted(value == 0);
    getAllVideoElements().forEach((video: HTMLVideoElement) => {
      // set volume.
      video.volume = value / 100;
    });
  };

  const onPlay = (play: boolean) => {
    setIsPlaying(play);

    getAllVideoElements().forEach((video: HTMLVideoElement) => {
      if (play) {
        video
          .play()
          .catch((error) => console.error("Video play failed.", error || ""));
        return;
      }

      video.pause();
    });
  };

  const onReset = () => {
    setReset(true);
  };

  return (
    <Container>
      <MediaControls
        isPlaying={isPlaying}
        onPlay={() => onPlay(!isPlaying)}
        isMuted={isMuted}
        onMute={() => onMute(!isMuted)}
        volume={isMuted ? 0 : volume}
        onVolume={(value) => onVolume(value)}
        onReset={onReset}
      ></MediaControls>
      <Player init={reset} onInit={() => setReset(false)} />
    </Container>
  );
};
