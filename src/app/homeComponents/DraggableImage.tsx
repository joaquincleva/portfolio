import React, { useRef, useState, useEffect } from "react";

const DraggableImage = ({images}:{images:String[]}) => {
  const [position, setPosition] = useState({ x: 50, y: 250 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setPosition((prev) => {
        const container = containerRef.current;
        if (!container) return prev;

        const containerRect = container.getBoundingClientRect();
        const nextX = prev.x + velocity.x;
        const nextY = prev.y + velocity.y;

        let newVelocityX = velocity.x;
        let newVelocityY = velocity.y;

        if (nextX <= 0 || nextX >= containerRect.width) {
          newVelocityX = -velocity.x;
        }

        if (nextY <= 0 || nextY >= containerRect.height) {
          newVelocityY = -velocity.y;
        }

        const clampedX = Math.max(0, Math.min(nextX, containerRect.width));
        const clampedY = Math.max(0, Math.min(nextY, containerRect.height));

        setVelocity({ x: newVelocityX * 0.95, y: newVelocityY * 0.95 });

        return { x: clampedX, y: clampedY };
      });

      setVelocity((prev) => ({
        x: prev.x * 0.95,
        y: prev.y * 0.95,
      }));

      if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (!isDragging) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging, velocity]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      setImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setIsDragging(true);
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastMousePosition.current.x;
      const dy = e.clientY - lastMousePosition.current.y;
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setVelocity({ x: dx, y: dy });
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        overflow: "hidden",
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: `absolute`,
          backgroundImage: `url('${images[imageIndex]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "150px",
          height: "150px",
          zIndex: 80,
          left: position.x,
          top: position.y,
          cursor: "grab",
          userSelect: "none",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

export default DraggableImage