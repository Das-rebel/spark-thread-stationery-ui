import { useEffect, useRef } from "react";

export function NeuralNetworkView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Neural network visualization
    const nodes = [
      // Input layer
      ...Array.from({ length: 4 }, (_, i) => ({ x: 50, y: 50 + i * 60, layer: 0 })),
      // Hidden layer 1
      ...Array.from({ length: 6 }, (_, i) => ({ x: 200, y: 30 + i * 50, layer: 1 })),
      // Hidden layer 2
      ...Array.from({ length: 4 }, (_, i) => ({ x: 350, y: 50 + i * 60, layer: 2 })),
      // Output layer
      ...Array.from({ length: 2 }, (_, i) => ({ x: 500, y: 80 + i * 80, layer: 3 })),
    ];

    let animationFrame: number;

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = "hsl(220, 40%, 25%)";
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].layer === nodes[i].layer + 1) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      ctx.globalAlpha = 1;
      nodes.forEach((node, index) => {
        const pulse = Math.sin(Date.now() * 0.003 + index * 0.5) * 0.3 + 0.7;
        
        // Node glow
        ctx.shadowColor = "hsl(355, 70%, 60%)";
        ctx.shadowBlur = 10 * pulse;
        
        // Node
        ctx.fillStyle = `hsl(355, 70%, ${60 + pulse * 20}%)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8 + pulse * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-64 bg-washi rounded-lg border border-border overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, hsl(45, 30%, 96%), hsl(45, 25%, 94%))" }}
      />
      <div className="absolute top-4 left-4">
        <span className="text-xs text-bamboo font-medium bg-washi px-2 py-1 rounded border">
          Neural Network Visualization
        </span>
      </div>
      <div className="absolute bottom-4 right-4">
        <span className="text-xs text-muted-foreground bg-washi px-2 py-1 rounded border">
          Real-time Activity
        </span>
      </div>
    </div>
  );
}