// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import fs from "fs";
import type { Config } from "./types";
import { useTimeout } from "../../hooks";

/// -------------------------------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .video-container {
    inline-size: 50%;
    block-size: 50vh;
    outline: 0.2rem solid black;

    video {
      object-fit: fill;
      inline-size: 100%;
      block-size: 100%;
      position: relative;
    }

    .overlayText {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 10;
      inline-size: 50%;
      user-select: none;

      p {
        color: #fff;
        text-shadow: 0.125rem 0.125rem 0.125rem #000;
        font-size: 0.8rem;
        align-self: center;
        padding: 0;
        margin: 0%;
      }
    }
  }
`;

Container.defaultProps = {
  className: "video-player-container",
};

async function getConfig(): Promise<Config> {
  try {
    const res = await fetch("config.json");

    if (!res || !res.ok) {
      throw new Error("cannot fetch config");
    }

    const json = await res.json();
    return json;
  } catch (e) {
    // console.error(e);
  }

  const json = await fs.readFileSync("../../config.json", "utf8");
  return JSON.parse(json);
}

interface VideoFeedProps extends React.MediaHTMLAttributes<HTMLVideoElement> {
  streamName: string;
  description: string;
  config: Config;
}

const Video: React.FunctionComponent<VideoFeedProps> = ({
  streamName,
  description,
  config,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [resetCount, _setRestCount] = useState<number>(0);

  const [resetConnection, setRestConnection] = useState<boolean>(false);

  const startTimeout = useTimeout(() => {
    console.log(`Timeout ${resetCount} reached!`);
    setRestConnection(true);
  }, /* 60 minutes */ 60 * 60 * 1000);

  useEffect(() => {
    setRestConnection(false);
    const stream = new MediaStream();
    const connection = new RTCPeerConnection();

    const asyncWork = async () => {
      const { client, server } = config;

      connection.oniceconnectionstatechange = (event) => {
        console.log("oniceconnectionstatechange", event);
      };

      connection.onnegotiationneeded = async (event) => {
        console.log("onnegotiationneeded", event);

        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);

        const streamUuid = streamName || client.defaultStream;

        const result = await fetch(
          `http://${location.hostname}${server.encoderPort}/stream/receiver/${streamUuid}`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: new URLSearchParams({
              suuid: `${streamUuid}`,
              data: Buffer.from(
                connection.localDescription?.sdp || ""
              ).toString("base64"),
            }),
          }
        );

        if (result && result.ok) {
          const data = await result.text();

          if (data.length === 0) {
            console.warn(
              "cannot connect:",
              `http://${location.hostname}${server.encoderPort}`
            );
            return;
          }

          connection.setRemoteDescription(
            new RTCSessionDescription({
              type: "answer",
              sdp: Buffer.from(data, "base64").toString(),
            })
          );

          console.log("negotiation start:", offer);
          return;
        }
      };

      connection.ontrack = ({ track }) => {
        stream.addTrack(track);

        if (videoRef.current) {
          const { current: video } = videoRef;
          video.srcObject = stream;

          video.onloadeddata = () => {
            console.log("resolution:", video.videoWidth, video.videoHeight);
          };

          console.log("received track:", track, track.getSettings());
        }
      };

      const streamUuid = streamName || client.defaultStream;

      let streams: any = [];
      try {
        const result = await fetch(
          `http://${location.hostname}${server.encoderPort}/stream/codec/${streamUuid}`
        );
        streams = result && result.ok ? await result.json() : [];
      } catch {
        /**/
      }

      if (streams.length === 0) {
        console.log("received no streams");
        return;
      }

      console.log("received streams:", streams);

      if (connection.signalingState === "closed") {
        console.log("connection closed");
        return;
      }

      for (const stream of streams) {
        connection.addTransceiver(stream.Type, { direction: "sendrecv" });
      }

      //
      const channel = connection.createDataChannel(streamUuid, {
        maxRetransmits: 10,
      });

      channel.onmessage = (event) => {
        console.log("channel message:", channel.label, "payload", event.data);
      };

      channel.onerror = (event) => {
        console.log("channel error:", channel.label, "payload", event);
      };

      channel.onopen = () => {
        console.log("channel open");
        const intervalId = setInterval(() => {
          if (channel.readyState !== "open") {
            clearInterval(intervalId);
            return;
          }
          channel.send("ping");
        }, 1000);
      };

      channel.onclose = () => {
        console.log("channel close");
        setRestConnection(true);
      };
    };

    asyncWork().catch((error) => {
      console.error(error.message || error);
    });

    startTimeout();

    return () => {
      connection.close();
    };
  }, [resetConnection]);

  return (
    <div className="video-container">
      <div className="overlayText">
        <p>{description}</p>
      </div>
      <video ref={videoRef} {...props} />
    </div>
  );
};

// Top of the page div.
const TopOfPage = styled.div`
  display: none;
`;

TopOfPage.defaultProps = {
  id: "top",
};

const BottomOfPage = styled.div`
  display: none;
`;

BottomOfPage.defaultProps = {
  id: "bottom",
};

// Player properties.
export interface PlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  init: boolean;
  onInit: () => void;
}

Player.defaultProps = {
  init: true,
  onInit: () => {},
  className: "video-player",
};

export function Player(props: PlayerProps) {
  const { init, onInit } = props;
  // const [scrolledTop, setScrolledTop] = useState<boolean>(true);

  // useEffect(() => {
  //   let topPage = document.querySelector("#top");
  //   let bottomPage = document.querySelector("#bottom");

  //   const interval = setInterval(() => {
  //     if (scrolledTop) {
  //       bottomPage?.scrollIntoView({ behavior: "smooth" });
  //       setScrolledTop(false);
  //       return;
  //     }

  //     topPage?.scrollIntoView({ behavior: "smooth" });
  //     setScrolledTop(true);
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, [scrolledTop]);

  // const [rtspStreams, setRtspStreams] = useState<Streams>();
  const [config, setConfig] = useState<Config>();

  useEffect(() => {
    setConfig(undefined);

    const asyncWork = async () => {
      const config = await getConfig();
      setConfig(config);
    };

    asyncWork().catch((e) => {
      console.error(e.message || e);
    });

    onInit();
  }, [init]);

  if (config) {
    const { streams = undefined } = config || {};

    return (
      <Container>
        <TopOfPage />
        {streams &&
          Object.entries(streams).map(([key, stream]) => (
            <Video
              key={key}
              streamName={key}
              description={stream.description || ""}
              config={config}
              autoPlay={true}
              controls={true}
            />
          ))}
        <BottomOfPage />
      </Container>
    );
  }

  return <div>loading...</div>;
}
