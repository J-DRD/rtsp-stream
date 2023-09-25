// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle } from "@fortawesome/free-solid-svg-icons";

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

export interface ResetButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  onReset: () => void;
  size?: "1x" | "2x" | "3x" | "4x" | "5x";
}

export const ResetButton: React.FunctionComponent<ResetButtonProps> = (
  props
) => {
  const { onReset, size = "1x" } = props;

  return (
    <Button onClick={onReset}>
      <FontAwesomeIcon icon={faRecycle} size={size} />
    </Button>
  );
};
