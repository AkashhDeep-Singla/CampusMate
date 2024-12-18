import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./MarqueeStyle.css";

const MarqueeComponent = () => {
  const marquees = useRef([]);

  useEffect(() => {
    // Initialize marquee animations
    marquees.current.forEach((el) => {
      gsap.set(el, {
        x: "100%",
      });
    });

    const animateMarquee = (direction) => {
      marquees.current.forEach((el) => {
        gsap.to(el, {
          x: direction === "forward" ? "-200%" : "100%",
          duration: 2,
          repeat: -1,
          ease: "none",
        });
      });

      gsap.to("#marque img", {
        rotate: direction === "forward" ? 180 : 0,
        duration: 1,
      });
    };

    const wheelListener = (e) => {
      if (e.deltaY > 0) {
        // Scrolling down
        animateMarquee("forward");
      } else {
        // Scrolling up
        animateMarquee("backward");
      }
    };

    window.addEventListener("wheel", wheelListener);

    return () => {
      window.removeEventListener("wheel", wheelListener);
    };
  }, []);

  return (
    <div id="move">
      {[...Array(7)].map((_, i) => (
        <div className="text-white"
          id="marque"
          key={i}
          ref={(el) => (marquees.current[i] = el)}
        >
          <h1>CampusMate</h1>
          <img
            src="/arrow-brown.svg"
            alt="arrow"
          />
        </div>
      ))}
    </div>
  );
};

export default MarqueeComponent;
