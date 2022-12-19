// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const Button = styled.button`
  background: none;
  border: none;
  color: var(--xyz-yellow04);
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  height: 2.875rem;

  svg {
    min-width: 2rem;
  }
`;

Button.defaultProps = {
  className: "mute-button",
};

export interface MuteButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  isMuted: boolean;
  onMute: () => void;
  size?: "1x" | "2x" | "3x" | "4x" | "5x";
}

export const MuteButton: React.FunctionComponent<MuteButtonProps> = (props) => {
  const { isMuted, onMute, size = "1x" } = props;

  const icon = isMuted ? faVolumeMute : faVolumeUp;

  return (
    <Button onClick={onMute} data-muted={isMuted}>
      <FontAwesomeIcon icon={icon} size={size} />
    </Button>
  );
};

MuteButton.displayName = "MuteButton";

MuteButton.defaultProps = {
  isMuted: true,
  onMute: undefined,
  size: "1x",
};
