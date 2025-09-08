import React, { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { MdCancel } from "react-icons/md";
import { NexButton, NexDiv } from "component/base/NexBaseComponents";

const ModalContainer = ({
  children,
  elementId,
}: {
  children: ReactNode;
  elementId: string;
}) => {
  // index.html에 id가 modal-root인 div를 만들어줘야 함
  const element = document.getElementById(elementId);

  if (!element) return null;
  return createPortal(children, element);
};

const useOutSideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback?.();
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
};

interface NexModalProps {
  isOpen: boolean;
  onClose?: () => void;
  label?: string;
  elementId?: string;
  style?: { overlay?: React.CSSProperties; content?: React.CSSProperties };
  children: ReactNode;
}

const NexModal = ({
  isOpen,
  onClose,
  label,
  elementId,
  children,
  style,
}: NexModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleClose = () => {
    onClose?.();
  };

  useOutSideClick(modalRef, handleClose);
  useEffect(() => {
    const $body = document.querySelector("body");
    if ($body) {
      $body.style.overflow = isOpen ? "hidden" : "auto";
    }
    return () => {
      if ($body) {
        $body.style.overflow = "auto";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalContainer elementId={elementId || "root"}>
      <Overlay style={style?.overlay}>
        <ModalWrap direction='column' ref={modalRef} style={style?.content}>
          <NexDiv direction='row' align='end'>
            <NexButton>
              <MdCancel onClick={handleClose} />
            </NexButton>
          </NexDiv>
          {label ? (
            <NexDiv direction='column' align='center'>
              <h2>{label}</h2>
            </NexDiv>
          ) : null}
          <NexDiv direction='column' align='center' margin='1rem'>
            {children}
          </NexDiv>
        </ModalWrap>
      </Overlay>
    </ModalContainer>
  );
};

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: #333;
  background: rgba(72, 147, 126, 0.2);
  z-index: 10;
`;

const ModalWrap = styled(NexDiv)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CloseButton = styled.div`
  float: right;
  width: 40px;
  height: 40px;
  margin: 20px;
  cursor: pointer;
  i {
    color: #5d5d5d;
    font-size: 30px;
  }
`;

const Contents = styled.div`
  margin: 50px 30px;
  h1 {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 60px;
  }
  img {
    margin-top: 60px;
    width: 300px;
  }
`;
const Button = styled.button`
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  background-color: #ababab;
  border-radius: 10px;
  color: white;
  font-style: italic;
  font-weight: 200;
  cursor: pointer;
  &:hover {
    background-color: #898989;
  }
`;

export default NexModal;
