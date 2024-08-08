import React, { useState, useLayoutEffect, useRef } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import PopArrow from "@/public/images/icons/popoverArrow.svg"

const PopoverWrapper = styled.div`
  position: absolute;
  z-index: 1000;
`

const PopoverTransitionContainer = styled.div`
  /* Note that we're using the same values for the enter states.
  /* This is to prevent an unpleasant scaling/opacity flicker if
  /* the user rapidly hovers & dehovers the trigger. Instead,
  /* we can simply start with the base styles below and then
  /* transition to the enter classes, while the enter-done
  /* class will prevent it from reverting to the base styles.*/
  opacity: 0;
  transition: opacity 0.25s cubic-bezier(0, 1, 0.4, 1),
    transform 0.25s cubic-bezier(0.18, 1.25, 0.4, 1);
  transform: scale(0.85);

  &.popover-enter,
  .popover-enter-active {
    opacity: 1;
    transform: scale(1);
  }
  &.popover-enter-done {
    opacity: 1;
    transform: scale(1);
  }

  &.popover-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.popover-exit-active {
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
`

const PopoverContainer = styled.div`
  background: white;
  box-shadow: 0 0 0 1px #8898aa1a, 0 15px 35px #31315d1a, 0 5px 15px #00000014;
  border-radius: 6px;
  padding: 20px;
  font-size: 14px;
  max-width: 300px;
`

const Arrow = styled(PopArrow)<{ position: string }>`
  position: absolute;
  width: 21px;
  height: 9px;

  & path {
    color: #fff;
  }
  ${({ position }) =>
    position === "top" &&
    `
    transform: rotate(180deg);
    bottom: -9px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  `}
  ${({ position }) =>
    position === "bottom" &&
    `
    top: -9px;
    left: 50%;
    transform: translateX(-50%);
  `}
  ${({ position }) =>
    position === "left" &&
    `
    transform: rotate(90deg);
    right: -14px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
  `}
  ${({ position }) =>
    position === "right" &&
    `
    transform: rotate(-90deg);
    left: -14px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
  `}
`

interface PopoverProps {
  trigger: "hover" | "click" | "focus"
  position?: "top" | "bottom" | "left" | "right"
  content: React.ReactNode
  children: React.ReactNode
  showArrow?: boolean
}

/**
 * Popover component to display content in a floating container relative to a trigger element.
 *
 * @param {PopoverProps} props - The properties object.
 * @param {React.ReactNode} props.children - The trigger element(s) for the popover.
 * @param {React.ReactNode} props.content - The content to be displayed inside the popover.
 * @param {"top" | "bottom" | "left" | "right"} [props.placement="bottom"] - The preferred placement of the popover.
 * @param {boolean} [props.showArrow=true] - Whether to show an arrow pointing to the trigger element.
 * @returns {JSX.Element} The rendered popover component.
 */
const Popover: React.FC<PopoverProps> = ({
  trigger,
  position = "bottom",
  content,
  children,
  showArrow = true,
}) => {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const calculatePosition = () => {
    if (triggerRef.current && wrapperRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const wrapperRect = wrapperRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      const scaledWidth = wrapperRect.width
      const scaledHeight = wrapperRect.height

      const scrollX = window.scrollX
      const scrollY = window.scrollY

      const positions = {
        top: {
          top: triggerRect.top + scrollY - scaledHeight - 10,
          left:
            triggerRect.left +
            scrollX +
            triggerRect.width / 2 -
            scaledWidth / 2,
        },
        bottom: {
          top: triggerRect.bottom + scrollY + 11,
          left:
            triggerRect.left +
            scrollX +
            triggerRect.width / 2 -
            scaledWidth / 2,
        },
        left: {
          top:
            triggerRect.top +
            scrollY +
            triggerRect.height / 2 -
            scaledHeight / 2,
          left: triggerRect.left + scrollX - scaledWidth - 10,
        },
        right: {
          top:
            triggerRect.top +
            scrollY +
            triggerRect.height / 2 -
            scaledHeight / 2,
          left: triggerRect.right + scrollX + 10,
        },
      }

      let { top, left } = positions[position]

      if (top < 0) top = 10
      if (left < 0) left = 10
      if (top + wrapperRect.height > viewportHeight + scrollY)
        top = viewportHeight + scrollY - wrapperRect.height - 10
      if (left + wrapperRect.width > viewportWidth + scrollX)
        left = viewportWidth + scrollX - wrapperRect.width - 10

      setCoords({ top, left })
    }
  }

  useLayoutEffect(() => {
    if (visible) {
      calculatePosition()
    }
  }, [visible, position, content])

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (wrapperRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect()
        if (
          wrapperRect.top < 0 ||
          wrapperRect.bottom > window.innerHeight ||
          wrapperRect.left < 0 ||
          wrapperRect.right > window.innerWidth
        ) {
          setTimeout(() => {
            setVisible(false)
          }, 250)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useLayoutEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setVisible(false)
      }
    }

    if (trigger === "click" && visible) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [trigger, visible])

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setVisible(false)
    }
  }

  const handleFocus = () => {
    if (trigger === "focus" || trigger === "hover") {
      setVisible(true)
    }
  }

  const handleBlur = () => {
    if (trigger === "focus" || trigger === "hover") {
      setVisible(false)
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => {
          if (trigger === "click") {
            setVisible(!visible)
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>
      {content &&
        content !== "" &&
        ReactDOM.createPortal(
          <PopoverWrapper
            ref={wrapperRef}
            style={{
              top: coords.top,
              left: coords.left,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <CSSTransition
              in={visible}
              timeout={250}
              classNames="popover"
              unmountOnExit
              onEnter={calculatePosition}
            >
              <PopoverTransitionContainer>
                {showArrow && <Arrow position={position} />}
                <PopoverContainer>{content}</PopoverContainer>
              </PopoverTransitionContainer>
            </CSSTransition>
          </PopoverWrapper>,
          document.body
        )}
    </>
  )
}

export default Popover
