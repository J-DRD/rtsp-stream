// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const Button = styled.button`
  background: none;
  border: none;
  color: var(--xyz-yellow04);
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
`;

Button.defaultProps = {
  className: "play-button",
};

export interface PlayButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  isPlaying: boolean;
  onPlay: () => void;
  size?: "1x" | "2x" | "3x" | "4x" | "5x";
}

export const PlayButton: React.FunctionComponent<PlayButtonProps> = (props) => {
  const { isPlaying, onPlay: onPlay, size = "1x" } = props;

  const icon = isPlaying ? faPause : faPlay;

  return (
    <Button onClick={onPlay}>
      <FontAwesomeIcon icon={icon} size={size} />
    </Button>
  );
};

PlayButton.displayName = "PlayButton";
PlayButton.defaultProps = {
  className: "play-button",
  isPlaying: false,
  onPlay: undefined,
  size: "1x",
};
