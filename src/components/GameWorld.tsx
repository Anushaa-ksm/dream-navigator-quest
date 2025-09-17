import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Plane, Box, Sphere, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Pixel Art Textures (Base64 encoded for immediate use)
const createPixelTexture = (data: number[][], colors: string[]) => {
  const size = data.length;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  data.forEach((row, y) => {
    row.forEach((colorIndex, x) => {
      if (colorIndex > 0) {
        ctx.fillStyle = colors[colorIndex - 1];
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
};

// Student Character Sprite Data (16x16 pixel art)
const studentSpriteData = [
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,2,2,3,2,2,2,2,3,2,2,1,0,0],
  [0,0,1,2,2,2,2,4,4,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,4,4,4,4,2,2,2,1,0,0],
  [0,0,0,1,2,2,2,4,4,2,2,2,1,0,0,0],
  [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
  [0,0,0,0,0,5,5,5,5,5,5,0,0,0,0,0],
  [0,0,0,0,5,5,6,5,5,6,5,5,0,0,0,0],
  [0,0,0,5,5,5,5,5,5,5,5,5,5,0,0,0],
  [0,0,5,5,7,5,5,5,5,5,5,7,5,5,0,0],
  [0,0,5,5,7,7,5,5,5,5,7,7,5,5,0,0],
  [0,0,0,5,8,8,5,5,5,5,8,8,5,0,0,0],
  [0,0,0,0,8,8,0,0,0,0,8,8,0,0,0,0],
  [0,0,0,0,8,8,0,0,0,0,8,8,0,0,0,0],
];

const studentColors = ['#8B4513', '#FDB462', '#4169E1', '#000000', '#FFB6C1', '#1E90FF', '#FF6347', '#32CD32'];

// Coin Sprite Data (8x8)
const coinSpriteData = [
  [0,0,1,1,1,1,0,0],
  [0,1,2,2,2,2,1,0],
  [1,2,3,2,2,3,2,1],
  [1,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,1],
  [1,2,3,2,2,3,2,1],
  [0,1,2,2,2,2,1,0],
  [0,0,1,1,1,1,0,0],
];

const coinColors = ['#FFD700', '#FFFF00', '#FFA500'];

// Career Island Sprites (12x12)
const islandSpriteData = [
  [0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,1,1,2,2,1,1,0,0,0],
  [0,0,1,2,2,2,2,2,2,1,0,0],
  [0,1,2,2,3,3,3,3,2,2,1,0],
  [0,1,2,3,3,4,4,3,3,2,1,0],
  [1,2,2,3,4,4,4,4,3,2,2,1],
  [1,2,2,3,4,4,4,4,3,2,2,1],
  [0,1,2,3,3,4,4,3,3,2,1,0],
  [0,1,2,2,3,3,3,3,2,2,1,0],
  [0,0,1,2,2,2,2,2,2,1,0,0],
  [0,0,0,1,1,2,2,1,1,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0],
];

const islandColors = ['#32CD32', '#228B22', '#8B4513', '#654321'];

interface PixelCharacterProps {
  position: [number, number, number];
  targetPosition: [number, number, number];
  isMoving: boolean;
  coins: number;
  level: number;
}

function PixelCharacter({ position, targetPosition, isMoving, coins, level }: PixelCharacterProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [currentPosition, setCurrentPosition] = useState<THREE.Vector3>(new THREE.Vector3(...position));
  const [bobOffset, setBobOffset] = useState(0);
  
  const studentTexture = useMemo(() => createPixelTexture(studentSpriteData, studentColors), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth movement to target
      if (isMoving) {
        const target = new THREE.Vector3(...targetPosition);
        currentPosition.lerp(target, delta * 3);
        meshRef.current.position.copy(currentPosition);
      }
      
      // Continuous bobbing animation
      setBobOffset(Math.sin(state.clock.elapsedTime * 4) * 0.1);
      meshRef.current.position.y = currentPosition.y + bobOffset + 0.5;
      
      // Rotation while moving
      if (isMoving) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 8) * 0.1;
      }
    }
  });

  return (
    <group ref={meshRef}>
      {/* Character Sprite */}
      <Plane args={[1, 1]} position={[0, 0.5, 0]}>
        <meshBasicMaterial map={studentTexture} transparent alphaTest={0.1} />
      </Plane>
      
      {/* Graduation Cap */}
      <Box args={[0.8, 0.1, 0.8]} position={[0, 1.1, 0]}>
        <meshBasicMaterial color="#1a1a1a" />
      </Box>
      
      {/* Level Badge */}
      <Plane args={[0.3, 0.3]} position={[0.7, 1.2, 0]}>
        <meshBasicMaterial color="#FFD700" />
      </Plane>
      <Text
        fontSize={0.15}
        position={[0.7, 1.2, 0.01]}
        color="#000"
        anchorX="center"
        anchorY="middle"
      >
        {level}
      </Text>
      
      {/* Progress Aura */}
      <Sphere args={[1.2]} position={[0, 0.5, 0]}>
        <meshBasicMaterial 
          color={level > 3 ? "#00FF00" : level > 1 ? "#FFFF00" : "#FF6347"} 
          transparent 
          opacity={0.1} 
        />
      </Sphere>
      
      {/* Floating Coins Display */}
      <Text
        fontSize={0.2}
        position={[0, 1.8, 0]}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
      >
        🪙 {coins}
      </Text>
    </group>
  );
}

interface GameCoinProps {
  position: [number, number, number];
  collected: boolean;
  onCollect: () => void;
}

function GameCoin({ position, collected, onCollect }: GameCoinProps) {
  const meshRef = useRef<THREE.Group>(null);
  const coinTexture = useMemo(() => createPixelTexture(coinSpriteData, coinColors), []);
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 0.2;
    }
  });

  if (collected) return null;

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={onCollect}
    >
      <Plane args={[0.5, 0.5]}>
        <meshBasicMaterial map={coinTexture} transparent alphaTest={0.1} />
      </Plane>
      <Sphere args={[0.4]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
      </Sphere>
    </group>
  );
}

interface CareerIslandProps {
  position: [number, number, number];
  type: 'tech' | 'healthcare' | 'arts' | 'business' | 'science';
  isActive: boolean;
  isUnlocked: boolean;
  onClick: () => void;
}

function CareerIsland({ position, type, isActive, isUnlocked, onClick }: CareerIslandProps) {
  const meshRef = useRef<THREE.Group>(null);
  const islandTexture = useMemo(() => createPixelTexture(islandSpriteData, islandColors), []);
  
  const careerData = {
    tech: { icon: '💻', color: '#3B82F6', name: 'Tech' },
    healthcare: { icon: '🏥', color: '#10B981', name: 'Healthcare' },
    arts: { icon: '🎨', color: '#8B5CF6', name: 'Arts' },
    business: { icon: '💼', color: '#F59E0B', name: 'Business' },
    science: { icon: '🔬', color: '#06B6D4', name: 'Science' },
  };
  
  const data = careerData[type];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += isActive ? 0.02 : 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * (isActive ? 0.3 : 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={isActive ? 1 : 0.3} floatIntensity={isActive ? 0.8 : 0.3}>
      <group 
        ref={meshRef} 
        position={position} 
        onClick={isUnlocked ? onClick : undefined}
      >
        {/* Island Base */}
        <Box args={[2, 0.5, 2]} position={[0, 0, 0]}>
          <meshBasicMaterial color={isUnlocked ? data.color : '#666'} />
        </Box>
        
        {/* Island Surface Texture */}
        <Plane args={[2, 2]} position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial 
            map={islandTexture} 
            transparent 
            alphaTest={0.1}
            opacity={isUnlocked ? 1 : 0.5}
          />
        </Plane>
        
        {/* Career Icon */}
        <Text
          fontSize={1.2}
          position={[0, 1, 0]}
          color={isUnlocked ? '#FFFFFF' : '#999'}
          anchorX="center"
          anchorY="middle"
        >
          {data.icon}
        </Text>
        
        {/* Career Name */}
        <Text
          fontSize={0.3}
          position={[0, 0.5, 0]}
          color={isUnlocked ? '#FFFFFF' : '#999'}
          anchorX="center"
          anchorY="middle"
        >
          {data.name}
        </Text>
        
        {/* Unlock Effect */}
        {isActive && isUnlocked && (
          <>
            <Sphere args={[3]} position={[0, 0.5, 0]}>
              <meshBasicMaterial color={data.color} transparent opacity={0.1} />
            </Sphere>
            {/* Particle effects could be added here */}
          </>
        )}
        
        {/* Lock Icon for locked islands */}
        {!isUnlocked && (
          <Text
            fontSize={0.5}
            position={[0, -0.3, 0]}
            color="#666"
            anchorX="center"
            anchorY="middle"
          >
            🔒
          </Text>
        )}
      </group>
    </Float>
  );
}

interface PowerUpProps {
  position: [number, number, number];
  type: 'speed' | 'wisdom' | 'star';
  collected: boolean;
  onCollect: () => void;
}

function PowerUp({ position, type, collected, onCollect }: PowerUpProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  const powerUpData = {
    speed: { icon: '⚡', color: '#FFFF00' },
    wisdom: { icon: '📚', color: '#8B5CF6' },
    star: { icon: '⭐', color: '#FFD700' },
  };
  
  const data = powerUpData[type];
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4 + position[0]) * 0.3;
    }
  });

  if (collected) return null;

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={onCollect}
    >
      <Text
        fontSize={0.8}
        position={[0, 0, 0]}
        color={data.color}
        anchorX="center"
        anchorY="middle"
      >
        {data.icon}
      </Text>
      <Sphere args={[0.6]} position={[0, 0, 0]}>
        <meshBasicMaterial color={data.color} transparent opacity={0.2} />
      </Sphere>
    </group>
  );
}

interface GameWorldProps {
  currentQuestion: number;
  totalQuestions: number;
  activePaths: string[];
  onPathSelect?: (pathId: string) => void;
  onCoinCollect?: () => void;
  onPowerUpCollect?: (type: string) => void;
}

export default function GameWorld({ 
  currentQuestion, 
  totalQuestions, 
  activePaths,
  onPathSelect,
  onCoinCollect,
  onPowerUpCollect
}: GameWorldProps) {
  const [studentPosition, setStudentPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [coins, setCoins] = useState(0);
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(new Set());
  const [collectedPowerUps, setCollectedPowerUps] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState(1);
  
  // Calculate progress and update student position
  useEffect(() => {
    const progress = currentQuestion / totalQuestions;
    const angle = (progress * Math.PI * 2) + Math.PI / 4; // Start from front-right
    const radius = progress * 4;
    
    setStudentPosition([
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ]);
    
    setLevel(Math.floor(progress * 5) + 1);
  }, [currentQuestion, totalQuestions]);

  // Career islands positions
  const careerIslands: Array<{ 
    id: string; 
    type: 'tech' | 'healthcare' | 'arts' | 'business' | 'science'; 
    position: [number, number, number] 
  }> = [
    { id: 'tech', type: 'tech', position: [6, 0, 0] },
    { id: 'healthcare', type: 'healthcare', position: [3, 0, 5] },
    { id: 'arts', type: 'arts', position: [-3, 0, 5] },
    { id: 'business', type: 'business', position: [-6, 0, 0] },
    { id: 'science', type: 'science', position: [0, 0, 6] },
  ];

  // Collectible coins positions
  const coinPositions: Array<[number, number, number]> = [
    [2, 1, 1], [-2, 1, 1], [1, 1, -2], [-1, 1, -2],
    [4, 1, 2], [-4, 1, 2], [2, 1, 4], [-2, 1, 4],
    [5, 1, 0], [-5, 1, 0], [0, 1, 5], [3, 1, -3],
  ];

  // Power-up positions
  const powerUpPositions = [
    { id: 'speed1', type: 'speed' as const, position: [3, 1.5, 3] as [number, number, number] },
    { id: 'wisdom1', type: 'wisdom' as const, position: [-3, 1.5, 3] as [number, number, number] },
    { id: 'star1', type: 'star' as const, position: [0, 1.5, -4] as [number, number, number] },
  ];

  const handleCoinCollect = (coinId: string) => {
    if (!collectedCoins.has(coinId)) {
      setCollectedCoins(prev => new Set([...prev, coinId]));
      setCoins(prev => prev + 10);
      onCoinCollect?.();
    }
  };

  const handlePowerUpCollect = (powerUpId: string, type: string) => {
    if (!collectedPowerUps.has(powerUpId)) {
      setCollectedPowerUps(prev => new Set([...prev, powerUpId]));
      onPowerUpCollect?.(type);
    }
  };

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 12, 12], fov: 75 }}>
        <Environment preset="sunset" />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#FFD700" />
        
        {/* Central Platform */}
        <Box args={[4, 0.2, 4]} position={[0, -0.1, 0]}>
          <meshBasicMaterial color="#32CD32" />
        </Box>
        
        {/* Game Grid Floor */}
        {Array.from({ length: 20 }, (_, i) => 
          Array.from({ length: 20 }, (_, j) => (
            <Plane 
              key={`${i}-${j}`}
              args={[1, 1]} 
              position={[(i - 10) * 1, -0.05, (j - 10) * 1]} 
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <meshBasicMaterial 
                color={(i + j) % 2 === 0 ? "#90EE90" : "#228B22"} 
                transparent 
                opacity={0.3} 
              />
            </Plane>
          ))
        )}
        
        {/* Student Character */}
        <PixelCharacter 
          position={[0, 0, 0]}
          targetPosition={studentPosition}
          isMoving={currentQuestion > 0}
          coins={coins}
          level={level}
        />
        
        {/* Career Islands */}
        {careerIslands.map((island) => (
          <CareerIsland
            key={island.id}
            position={island.position}
            type={island.type}
            isActive={activePaths.includes(island.id)}
            isUnlocked={currentQuestion >= 2 || island.id === 'tech'} // Unlock progressively
            onClick={() => onPathSelect?.(island.id)}
          />
        ))}
        
        {/* Collectible Coins */}
        {coinPositions.map((position, index) => (
          <GameCoin
            key={`coin-${index}`}
            position={position}
            collected={collectedCoins.has(`coin-${index}`)}
            onCollect={() => handleCoinCollect(`coin-${index}`)}
          />
        ))}
        
        {/* Power-ups */}
        {powerUpPositions.map((powerUp) => (
          <PowerUp
            key={powerUp.id}
            position={powerUp.position}
            type={powerUp.type}
            collected={collectedPowerUps.has(powerUp.id)}
            onCollect={() => handlePowerUpCollect(powerUp.id, powerUp.type)}
          />
        ))}
        
        {/* Path Connections */}
        {activePaths.map((pathId) => {
          const island = careerIslands.find(i => i.id === pathId);
          if (!island) return null;
          
          const start = new THREE.Vector3(0, 0.1, 0);
          const end = new THREE.Vector3(...island.position);
          const distance = start.distanceTo(end);
          
          return (
            <Box 
              key={`path-${pathId}`}
              args={[0.1, 0.1, distance]} 
              position={[end.x / 2, 0.2, end.z / 2]}
              rotation={[0, -Math.atan2(end.z, end.x), 0]}
            >
              <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
            </Box>
          );
        })}
        
        {/* Game UI Elements in 3D Space */}
        <Text
          fontSize={0.5}
          position={[0, 8, -5]}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          Level {level} • Question {currentQuestion}/{totalQuestions}
        </Text>
        
        <Text
          fontSize={0.3}
          position={[0, 7, -5]}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Collect coins and power-ups on your career journey!
        </Text>
        
        {/* Controls */}
        <OrbitControls 
          enablePan={true} 
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={8} 
          maxDistance={25} 
        />
      </Canvas>
    </div>
  );
}