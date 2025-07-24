import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Pause, Zap } from "lucide-react";

interface NodeData {
  position: [number, number, number];
  layer: number;
  id: string;
  activity: number;
  connections: string[];
}

function NetworkNode({ position, activity, layer, onClick }: { 
  position: [number, number, number]; 
  activity: number; 
  layer: number;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const scale = 0.8 + Math.sin(time * 2 + activity * 10) * 0.2;
      meshRef.current.scale.setScalar(Math.max(0.5, scale));
    }
  });

  const color = useMemo(() => {
    const hue = layer * 60;
    const lightness = Math.max(20, Math.min(80, 50 + activity * 30));
    return new THREE.Color(`hsl(${hue}, 70%, ${lightness}%)`);
  }, [layer, activity]);

  return (
    <mesh 
      ref={meshRef}
      position={position} 
      onClick={onClick}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={activity * 0.3}
        metalness={0.1}
        roughness={0.3}
      />
    </mesh>
  );
}

function NetworkConnection({ start, end, activity }: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
  activity: number;
}) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  const color = useMemo(() => {
    const lightness = Math.max(20, Math.min(80, 30 + activity * 50));
    return new THREE.Color(`hsl(200, 70%, ${lightness}%)`);
  }, [activity]);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.3 + activity * 0.4
    }))} />
  );
}

function Scene({ nodes, isAnimating }: { nodes: NodeData[]; isAnimating: boolean }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeActivities, setNodeActivities] = useState<Record<string, number>>(() => {
    const activities: Record<string, number> = {};
    nodes.forEach((node, index) => {
      activities[node.id] = Math.random();
    });
    return activities;
  });
  
  useFrame((state) => {
    if (isAnimating) {
      // Update node activities with wave patterns without mutating props
      const time = state.clock.getElapsedTime();
      const newActivities: Record<string, number> = {};
      nodes.forEach((node, index) => {
        newActivities[node.id] = Math.abs(Math.sin(time * 0.5 + index * 0.3));
      });
      setNodeActivities(newActivities);
    }
  });

  const connections = useMemo(() => {
    const conns: Array<{ start: [number, number, number]; end: [number, number, number]; activity: number }> = [];
    
    nodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const targetNode = nodes.find(n => n.id === connId);
        if (targetNode) {
          const nodeActivity = nodeActivities[node.id] || 0;
          const targetActivity = nodeActivities[targetNode.id] || 0;
          conns.push({
            start: node.position,
            end: targetNode.position,
            activity: (nodeActivity + targetActivity) / 2
          });
        }
      });
    });
    
    return conns;
  }, [nodes, nodeActivities]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
      
      {/* Render connections first (behind nodes) */}
      {connections.map((conn, index) => (
        <NetworkConnection
          key={index}
          start={conn.start}
          end={conn.end}
          activity={conn.activity}
        />
      ))}
      
      {/* Render nodes */}
      {nodes.map((node) => (
        <NetworkNode
          key={node.id}
          position={node.position}
          activity={nodeActivities[node.id] || 0}
          layer={node.layer}
          onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
        />
      ))}
      
      {/* Layer labels */}
      <Text position={[-6, 3, 0]} fontSize={0.8} color="hsl(var(--muted-foreground))">
        Input
      </Text>
      <Text position={[-2, 3, 0]} fontSize={0.8} color="hsl(var(--muted-foreground))">
        Hidden 1
      </Text>
      <Text position={[2, 3, 0]} fontSize={0.8} color="hsl(var(--muted-foreground))">
        Hidden 2
      </Text>
      <Text position={[6, 3, 0]} fontSize={0.8} color="hsl(var(--muted-foreground))">
        Output
      </Text>
      
      {selectedNode && (
        <Text 
          position={[0, -4, 0]} 
          fontSize={0.6} 
          color="hsl(var(--primary))"
          anchorX="center"
        >
          Node {selectedNode} Selected
        </Text>
      )}
    </>
  );
}

export function NeuralNetworkView() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [networkSpeed, setNetworkSpeed] = useState(1);
  
  const nodes = useMemo(() => {
    const nodeData: NodeData[] = [];
    
    // Input layer (4 nodes)
    for (let i = 0; i < 4; i++) {
      nodeData.push({
        id: `input-${i}`,
        position: [-6, 2 - i * 1.5, 0] as [number, number, number],
        layer: 0,
        activity: Math.random(),
        connections: [`hidden1-0`, `hidden1-1`, `hidden1-2`, `hidden1-3`, `hidden1-4`, `hidden1-5`]
      });
    }
    
    // Hidden layer 1 (6 nodes)
    for (let i = 0; i < 6; i++) {
      nodeData.push({
        id: `hidden1-${i}`,
        position: [-2, 3 - i * 1.2, 0] as [number, number, number],
        layer: 1,
        activity: Math.random(),
        connections: [`hidden2-0`, `hidden2-1`, `hidden2-2`, `hidden2-3`]
      });
    }
    
    // Hidden layer 2 (4 nodes)
    for (let i = 0; i < 4; i++) {
      nodeData.push({
        id: `hidden2-${i}`,
        position: [2, 2 - i * 1.5, 0] as [number, number, number],
        layer: 2,
        activity: Math.random(),
        connections: [`output-0`, `output-1`]
      });
    }
    
    // Output layer (2 nodes)
    for (let i = 0; i < 2; i++) {
      nodeData.push({
        id: `output-${i}`,
        position: [6, 0.5 - i * 1, 0] as [number, number, number],
        layer: 3,
        activity: Math.random(),
        connections: []
      });
    }
    
    return nodeData;
  }, []);

  const resetNetwork = () => {
    nodes.forEach(node => {
      node.activity = Math.random();
    });
  };

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-background to-muted rounded-lg border border-border overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene nodes={nodes} isAnimating={isAnimating} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={8} 
          maxDistance={25}
          autoRotate={isAnimating}
          autoRotateSpeed={networkSpeed}
        />
      </Canvas>
      
      {/* Control Panel */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Badge variant="secondary" className="text-xs font-inter">
          <Zap className="w-3 h-3 mr-1" />
          Neural Network 3D
        </Badge>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isAnimating ? "default" : "outline"}
            onClick={() => setIsAnimating(!isAnimating)}
            className="text-xs"
          >
            {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetNetwork}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Info Panel */}
      <div className="absolute bottom-4 right-4">
        <Badge variant="outline" className="text-xs font-inter bg-background/80 backdrop-blur-sm">
          {nodes.length} Nodes • Interactive • Real-time
        </Badge>
      </div>
      
      {/* Speed Control */}
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 border">
          <span className="text-xs text-muted-foreground font-inter">Speed:</span>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={networkSpeed}
            onChange={(e) => setNetworkSpeed(parseFloat(e.target.value))}
            className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}