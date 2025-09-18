import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

// Tree Component
const Tree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const treeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={treeRef} position={position}>
      {/* Tree trunk */}
      <Box args={[0.4, 2, 0.4]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Tree foliage */}
      <Sphere args={[1.5, 8, 8]} position={[0, 3, 0]}>
        <meshStandardMaterial color="#228B22" />
      </Sphere>
      <Sphere args={[1.2, 8, 8]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#32CD32" />
      </Sphere>
    </group>
  );
};

// Maze Walls Component
const MazeWalls: React.FC = () => {
  const mazeLayout = [
    // Create a simple maze pattern around the center
    { pos: [-6, 0.5, -3], size: [0.5, 1, 2] },
    { pos: [-6, 0.5, 3], size: [0.5, 1, 2] },
    { pos: [6, 0.5, -3], size: [0.5, 1, 2] },
    { pos: [6, 0.5, 3], size: [0.5, 1, 2] },
    { pos: [-3, 0.5, -6], size: [2, 1, 0.5] },
    { pos: [3, 0.5, -6], size: [2, 1, 0.5] },
    { pos: [-3, 0.5, 6], size: [2, 1, 0.5] },
    { pos: [3, 0.5, 6], size: [2, 1, 0.5] },
  ];

  return (
    <>
      {mazeLayout.map((wall, i) => (
        <Box 
          key={i} 
          args={wall.size as [number, number, number]} 
          position={wall.pos as [number, number, number]}
        >
          <meshStandardMaterial color="#4c1d95" emissive="#312e81" emissiveIntensity={0.2} />
        </Box>
      ))}
    </>
  );
};

// Career Roads Component
const CareerRoads: React.FC<{ activePaths: string[]; dominantPath: string }> = ({ activePaths, dominantPath }) => {
  return (
    <>
      {careerPaths.map((path) => {
        const isActive = activePaths.includes(path.name);
        const isDominant = dominantPath === path.name;
        
        // Create road segments from center to career island
        const segments = Array.from({ length: 15 }, (_, i) => {
          const progress = (i + 1) / 15;
          const segmentPos: [number, number, number] = [
            path.position[0] * progress * 0.8,
            0.02,
            path.position[2] * progress * 0.8
          ];
          
          return (
            <Box
              key={`road-${path.name}-${i}`}
              args={[0.8, 0.05, 0.8]}
              position={segmentPos}
            >
              <meshStandardMaterial 
                color={isActive ? path.color : '#444444'} 
                emissive={isDominant ? path.color : '#000000'}
                emissiveIntensity={isDominant ? 0.4 : 0}
                transparent
                opacity={isActive ? 0.9 : 0.3}
              />
            </Box>
          );
        });
        
        return <group key={`road-${path.name}`}>{segments}</group>;
      })}
    </>
  );
};

// Floating cloud component
const FloatingCloud: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5) * 2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Sphere args={[0.8, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </Sphere>
      <Sphere args={[0.6, 16, 16]} position={[-0.5, 0.2, 0]}>
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </Sphere>
      <Sphere args={[0.5, 16, 16]} position={[0.5, 0.1, 0]}>
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </Sphere>
    </group>
  );
};

// Floating decorative gems
const FloatingGem: React.FC<{ position: [number, number, number]; color: string; type: 'heart' | 'diamond' | 'star' }> = ({ position, color, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={0.3}>
      {type === 'heart' && (
        <sphereGeometry args={[0.5, 16, 16]} />
      )}
      {type === 'diamond' && (
        <octahedronGeometry args={[0.5, 0]} />
      )}
      {type === 'star' && (
        <boxGeometry args={[0.8, 0.2, 0.2]} />
      )}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
};

// Collectible items
interface FloatingElementProps {
  position: [number, number, number];
  type: 'coin' | 'powerup';
  onCollect?: () => void;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ position, type, onCollect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  const handleClick = () => {
    if (onCollect) onCollect();
  };

  const color = type === 'coin' ? '#FFD700' : '#FF69B4';

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      scale={type === 'coin' ? [0.3, 0.1, 0.3] : [0.2, 0.2, 0.2]}
    >
      {type === 'coin' ? (
        <cylinderGeometry args={[0.5, 0.5, 0.2, 8]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
};

// Student Character
interface StudentCharacterProps {
  targetPosition: [number, number, number];
  activePaths: string[];
  dominantPath: string;
}

const StudentCharacter: React.FC<StudentCharacterProps> = ({ targetPosition, activePaths, dominantPath }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth movement towards target
      meshRef.current.position.lerp(new THREE.Vector3(...targetPosition), 0.1);
      
      // Bobbing animation
      meshRef.current.position.y = targetPosition[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.5;
      
      // Slight rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const color = dominantPath ? careerPaths.find(p => p.name === dominantPath)?.color || '#3b82f6' : '#3b82f6';

  return (
    <group ref={meshRef}>
      {/* Student body */}
      <Box args={[0.5, 1, 0.3]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Box>
      
      {/* Student head */}
      <Sphere args={[0.3, 16, 16]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#fdbf47" />
      </Sphere>
      
      {/* Graduation cap */}
      <Box args={[0.6, 0.1, 0.6]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      
      {/* Aura indicating progress */}
      <Sphere args={[1.2, 16, 16]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.2} />
      </Sphere>
      
      {/* Path indicator */}
      {dominantPath && (
        <Text
          fontSize={0.3}
          position={[0, 2, 0]}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          → {dominantPath.toUpperCase()}
        </Text>
      )}
    </group>
  );
};

// Career Island Component
interface CareerIslandProps {
  position: [number, number, number];
  color: string;
  name: string;
  isActive: boolean;
  isDominant: boolean;
  score: number;
}

const CareerIsland: React.FC<CareerIslandProps> = ({ position, color, name, isActive, isDominant, score }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += isDominant ? 0.02 : 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * (isDominant ? 0.3 : 0.1);
    }
  });

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'tech': return '💻';
      case 'healthcare': return '🏥';
      case 'arts': return '🎨';
      case 'business': return '💼';
      case 'science': return '🔬';
      default: return '🎯';
    }
  };

  return (
    <group ref={meshRef} position={position}>
      {/* Island base */}
      <Box args={[2.5, 0.5, 2.5]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={isActive ? color : '#666666'} 
          emissive={isDominant ? color : '#000000'}
          emissiveIntensity={isDominant ? 0.3 : 0}
        />
      </Box>
      
      {/* Career icon */}
      <Text
        fontSize={1.5}
        position={[0, 1.5, 0]}
        color={isActive ? '#ffffff' : '#999999'}
        anchorX="center"
        anchorY="middle"
      >
        {getIcon(name)}
      </Text>
      
      {/* Career name */}
      <Text
        fontSize={0.4}
        position={[0, 0.8, 0]}
        color={isActive ? '#ffffff' : '#999999'}
        anchorX="center"
        anchorY="middle"
      >
        {name.toUpperCase()}
      </Text>
      
      {/* Score display for active paths */}
      {isActive && score > 0 && (
        <Text
          fontSize={0.3}
          position={[0, 0.3, 0]}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          {score} pts
        </Text>
      )}
      
      {/* Dominant path effect */}
      {isDominant && (
        <Sphere args={[3.5, 16, 16]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color={color} transparent opacity={0.1} />
        </Sphere>
      )}
    </group>
  );
};

// Career path definitions
const careerPaths = [
  { name: 'tech', position: [8, 0, 0] as [number, number, number], color: '#3b82f6' },
  { name: 'healthcare', position: [4, 0, 6] as [number, number, number], color: '#10b981' },
  { name: 'arts', position: [-4, 0, 6] as [number, number, number], color: '#8b5cf6' },
  { name: 'business', position: [-8, 0, 0] as [number, number, number], color: '#f59e0b' },
  { name: 'science', position: [0, 0, 8] as [number, number, number], color: '#06b6d4' },
];

interface GameWorldProps {
  currentQuestion: number;
  totalQuestions: number;
  activePaths: string[];
  dominantPath: string;
  pathScores: Record<string, number>;
  onCoinCollect?: () => void;
  onPowerUpCollect?: (type: string) => void;
}

// Main Scene Component
const Scene: React.FC<GameWorldProps> = ({
  currentQuestion,
  totalQuestions,
  activePaths,
  dominantPath,
  pathScores,
  onCoinCollect,
  onPowerUpCollect
}) => {
  const studentPosition = useMemo(() => {
    if (!dominantPath) return [0, 0, 0] as [number, number, number];
    
    const targetPath = careerPaths.find(path => path.name === dominantPath);
    if (!targetPath) return [0, 0, 0] as [number, number, number];
    
    const progress = Math.min((pathScores[dominantPath] || 0) / 100, 0.8);
    return [
      targetPath.position[0] * progress,
      targetPath.position[1] * progress,
      targetPath.position[2] * progress
    ] as [number, number, number];
  }, [dominantPath, pathScores]);

  return (
    <>
      {/* Atmospheric Lighting */}
      <ambientLight intensity={0.3} color="#4c1d95" />
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#8b5cf6" />
      <pointLight position={[10, 5, 10]} intensity={0.8} color="#a855f7" />
      <pointLight position={[-10, 5, -10]} intensity={0.8} color="#c084fc" />
      
      {/* Background Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.03, 4, 4]}
          position={[
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 30 + 25,
            (Math.random() - 0.5) * 80
          ]}
        >
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      ))}

      {/* Maze Walls */}
      <MazeWalls />
      
      {/* Trees around the perimeter */}
      <Tree position={[-15, 0, -15]} />
      <Tree position={[15, 0, -15]} />
      <Tree position={[-15, 0, 15]} />
      <Tree position={[15, 0, 15]} />
      <Tree position={[-12, 0, 0]} />
      <Tree position={[12, 0, 0]} />
      <Tree position={[0, 0, -12]} />
      
      {/* Career Path Roads */}
      <CareerRoads activePaths={activePaths} dominantPath={dominantPath} />

      {/* Student Character */}
      <StudentCharacter 
        targetPosition={studentPosition}
        activePaths={activePaths}
        dominantPath={dominantPath}
      />

      {/* Career Path Islands */}
      {careerPaths.map((path, index) => (
        <CareerIsland
          key={path.name}
          position={path.position}
          color={path.color}
          name={path.name}
          isActive={activePaths.includes(path.name)}
          isDominant={dominantPath === path.name}
          score={pathScores[path.name] || 0}
        />
      ))}

      {/* Collectible Elements */}
      <FloatingElement
        position={[3, 1, 2]}
        type="coin"
        onCollect={onCoinCollect}
      />
      <FloatingElement
        position={[-3, 1.5, -2]}
        type="powerup"
        onCollect={() => onPowerUpCollect?.('speed')}
      />
      <FloatingElement
        position={[1, 2, -3]}
        type="coin"
        onCollect={onCoinCollect}
      />

      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </>
  );
};

const GameWorld: React.FC<GameWorldProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 12, 15], fov: 50 }}
        style={{ 
          background: 'linear-gradient(to bottom, #0f0f23 0%, #1e1b4b 30%, #312e81 70%, #4c1d95 100%)',
        }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
};

export default GameWorld;