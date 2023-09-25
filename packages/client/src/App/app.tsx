// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React, { useEffect } from "react";
import styled from "styled-components";
import { MediaControls, Player } from "../Components";
import createPersistedState from "use-persisted-state";
import dotenvParseVariables from "dotenv-parse-variables";
import { useTimeout } from "../hooks";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

Container.defaultProps = {
  className: "app-container",
};

const useMuteState = createPersistedState("muted");
const useVolumeState = createPersistedState("volume");

const env = dotenvParseVariables(process.env);

const { RELOAD_PAGE_INTERVAL: reloadPageInterval = 30 * 60 * 1000 } = env;

export const App: React.FunctionComponent = () => {
  // Playing state.
  const [playing, setPlaying] = React.useState(true);

  // Mute state.
  const [muted, setMuted] = useMuteState(false);

  // Volume state.
  const [volume, setVolume] = useVolumeState(100);

  // Reset state.
  const [reset, setReset] = React.useState(false);

  const getAllVideoElements = () => {
    return document.querySelectorAll("video");
  };

  const startReloadPage = useTimeout(() => {
    console.log(`♻️ Reload page timeout reached. ${reloadPageInterval}`);
    window.location.reload();
  }, reloadPageInterval);

  // Mute all videos.
  const onMute = (mute: boolean) => {
    setMuted(mute);
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
    setMuted(value == 0);
    getAllVideoElements().forEach((video: HTMLVideoElement) => {
      // set volume.
      video.volume = value / 100;
    });
  };

  const onPlay = (play: boolean) => {
    setPlaying(play);

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

  const onInit = () => {
    setReset(false);
  };

  useEffect(() => {
    startReloadPage;
  }, []);

  return (
    <Container>
      <MediaControls
        isPlaying={playing}
        onPlay={() => onPlay(!playing)}
        isMuted={muted}
        onMute={() => onMute(!muted)}
        volume={muted ? 0 : volume}
        onVolume={(value) => onVolume(value)}
        onReset={onReset}
      ></MediaControls>
      <Player init={reset} onInit={onInit} volume={volume} />
    </Container>
  );
};
