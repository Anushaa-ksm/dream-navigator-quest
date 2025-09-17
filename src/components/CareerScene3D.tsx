import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder, Float, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface CareerPath {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  icon: string;
}

const careerPaths: CareerPath[] = [
  { id: 'tech', name: 'Technology', position: [4, 0, 0], color: '#3B82F6', icon: '💻' },
  { id: 'healthcare', name: 'Healthcare', position: [2, 0, 3], color: '#10B981', icon: '🏥' },
  { id: 'arts', name: 'Arts & Design', position: [-2, 0, 3], color: '#8B5CF6', icon: '🎨' },
  { id: 'business', name: 'Business', position: [-4, 0, 0], color: '#F59E0B', icon: '💼' },
  { id: 'science', name: 'Science', position: [0, 0, 4], color: '#06B6D4', icon: '🔬' },
];

interface StudentCharacterProps {
  position: [number, number, number];
  targetPosition: [number, number, number];
  isMoving: boolean;
}

function StudentCharacter({ position, targetPosition, isMoving }: StudentCharacterProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [currentPosition, setCurrentPosition] = useState<THREE.Vector3>(new THREE.Vector3(...position));

  useFrame((state, delta) => {
    if (meshRef.current && isMoving) {
      const target = new THREE.Vector3(...targetPosition);
      currentPosition.lerp(target, delta * 2);
      meshRef.current.position.copy(currentPosition);
      
      // Add floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Student Body */}
      <Cylinder args={[0.3, 0.3, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4F46E5" />
      </Cylinder>
      
      {/* Student Head */}
      <Sphere args={[0.25]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#FDE68A" />
      </Sphere>
      
      {/* Graduation Cap */}
      <Box args={[0.6, 0.05, 0.6]} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#1F2937" />
      </Box>
      
      {/* Graduation Cap Tassel */}
      <Sphere args={[0.03]} position={[0.3, 1.1, 0]}>
        <meshStandardMaterial color="#EF4444" />
      </Sphere>
      
      {/* Progress Glow */}
      <Sphere args={[1]} position={[0, 0.5, 0]}>
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.1} />
      </Sphere>
    </group>
  );
}

function CareerIsland({ path, isActive, onClick }: { path: CareerPath; isActive: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + path.position[0]) * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef} position={path.position} onClick={onClick}>
        {/* Island Base */}
        <Cylinder args={[1.5, 1.2, 0.5]} position={[0, -0.25, 0]}>
          <meshStandardMaterial color={isActive ? path.color : '#64748B'} />
        </Cylinder>
        
        {/* Career Symbol */}
        <Text
          fontSize={1}
          position={[0, 0.5, 0]}
          color={isActive ? '#FFFFFF' : '#94A3B8'}
          anchorX="center"
          anchorY="middle"
        >
          {path.icon}
        </Text>
        
        {/* Career Name */}
        <Text
          fontSize={0.3}
          position={[0, -0.5, 0]}
          color={isActive ? '#FFFFFF' : '#64748B'}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {path.name}
        </Text>
        
        {/* Glow Effect for Active Path */}
        {isActive && (
          <Sphere args={[2]} position={[0, 0, 0]}>
            <meshBasicMaterial color={path.color} transparent opacity={0.1} />
          </Sphere>
        )}
      </group>
    </Float>
  );
}

function ConnectingPaths({ activePaths }: { activePaths: string[] }) {
  return (
    <group>
      {careerPaths.map((path, index) => {
        const isActive = activePaths.includes(path.id);
        if (!isActive) return null;
        
        const startPos = new THREE.Vector3(0, 0, 0);
        const endPos = new THREE.Vector3(...path.position);
        const distance = startPos.distanceTo(endPos);
        
        return (
          <group key={path.id}>
            <Cylinder 
              args={[0.05, 0.05, distance]} 
              position={[endPos.x / 2, 0.1, endPos.z / 2]}
              rotation={[0, -Math.atan2(endPos.z, endPos.x), Math.atan2(distance, endPos.y)]}
            >
              <meshStandardMaterial color={path.color} emissive={path.color} emissiveIntensity={0.2} />
            </Cylinder>
          </group>
        );
      })}
    </group>
  );
}

interface CareerScene3DProps {
  currentQuestion: number;
  totalQuestions: number;
  activePaths: string[];
  studentPosition: [number, number, number];
  onPathSelect?: (pathId: string) => void;
}

export default function CareerScene3D({ 
  currentQuestion, 
  totalQuestions, 
  activePaths, 
  studentPosition,
  onPathSelect 
}: CareerScene3DProps) {
  const progress = currentQuestion / totalQuestions;
  const targetPosition: [number, number, number] = [
    studentPosition[0] * progress,
    studentPosition[1],
    studentPosition[2] * progress
  ];

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 8, 8], fov: 75 }}>
        <Environment preset="dawn" />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#3B82F6" />
        
        {/* Central Platform */}
        <Cylinder args={[2, 2, 0.2]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#E5E7EB" />
        </Cylinder>
        
        {/* Student Character */}
        <StudentCharacter 
          position={[0, 0, 0]} 
          targetPosition={targetPosition}
          isMoving={currentQuestion > 0}
        />
        
        {/* Career Islands */}
        {careerPaths.map((path) => (
          <CareerIsland
            key={path.id}
            path={path}
            isActive={activePaths.includes(path.id)}
            onClick={() => onPathSelect?.(path.id)}
          />
        ))}
        
        {/* Connecting Paths */}
        <ConnectingPaths activePaths={activePaths} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2} 
          minDistance={5} 
          maxDistance={20} 
        />
      </Canvas>
    </div>
  );
}