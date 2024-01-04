import React, { type ReactNode, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { IconLoader2 } from "@tabler/icons-react";

interface PullToRefreshProps {
  onRefresh: () => void;
  children: ReactNode;
}

const PullToRefresh = (props: PullToRefreshProps) => {
  const { onRefresh, children } = props;
  const [refresh, setRefresh] = useState(false);
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useGesture({
    onWheel: ({ delta: [, dy], first, last }) => {
      if (first) {
        setRefresh(false);
      }

      if (dy < 0) {
        if (!refresh) {
          api.start({ y: dy });
        }
        if (dy < -200) {
          setRefresh(true);
          api.start({ y: -200 });
          api.start({ y: 0, delay: 1500 });
        } else if (!refresh) {
          api.start({ y: 0 });
        }
      }
      if (last) {
        if (refresh) {
          onRefresh();
          setRefresh(false);
        }
      }
    },
  });

  return (
    <div className="overflow-hidden" style={{ height: "calc(100%-3.5rem)" }}>
      <animated.div
        {...bind()}
        style={{
          touchAction: "none",
          overflowY: "hidden",
          position: "relative",
          height: "100%",
          transform: y.to(
            (py) => `translate3d(0,${-64 - (py < -100 ? -100 : py)}px,0)`,
          ),
        }}
      >
        <div className=" flex h-16 w-full items-center justify-center">
          <IconLoader2 size={32} className=" animate-spin" />
        </div>
        {children}
      </animated.div>
    </div>
  );
};

export default PullToRefresh;
