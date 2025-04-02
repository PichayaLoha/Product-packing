import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Edges, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useLocation, useNavigate } from 'react-router-dom';

// Define types
interface ProductData {
  package_box_id: number;
  product_name: string;
  product_length: number;
  product_width: number;
  product_height: number;
  package_box_x: number;
  package_box_y: number;
  package_box_z: number;
  box_name: string;
  box_length: number;
  box_width: number;
  box_height: number;
}

interface ProductProps {
  size: [number, number, number];
  position: [number, number, number];
  color: string;
  name: string;
}

interface BoxProps {
  boxSize: [number, number, number];
  products: ProductData[];
  rotation: [number, number, number];
  boxName: string;
}

interface ProductNameColor {
  name: string;
  color: string;
}

interface LocationState {
  package_dels_id?: number;
  message?: number;
}

const colors: string[] = [
  "#FF4B4B", // red
  "#4B83FF", // blue
  "#4BFF91", // green
  "#FFD84B", // yellow
  "#FF4BF2", // magenta
  "#4BFFFC", // cyan
  "#FF964B", // orange
  "#964BFF", // purple
];

const getRandomColor = (usedColors: Set<string>): string => {
  let color = colors[Math.floor(Math.random() * colors.length)];
  while (usedColors.has(color)) {
    color = colors[Math.floor(Math.random() * colors.length)];
  }
  return color;
};

// สร้างออบเจ็กต์เพื่อเก็บสีของสินค้าแต่ละชื่อ
const productColors: Record<string, string> = {};

const Product = ({
  size,
  position,
  color,
  name
}: ProductProps) => {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.2}
          emissive={hovered ? color : "black"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
        <Edges color="black" threshold={15} />
      </mesh>

      {hovered && (
        <Text
          position={[0, size[1] / 2 + 0.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {name}
        </Text>
      )}
    </group>
  );
};

const Box = ({
  boxSize,
  products,
  rotation,
  boxName
}: BoxProps) => {
  const startX = -boxSize[0] / 2;
  const startY = -boxSize[1] / 2;
  const startZ = -boxSize[2] / 2;

  return (
    <group rotation={rotation}>
      {/* Box outline */}
      <mesh>
        <boxGeometry args={boxSize} />
        <meshStandardMaterial color="gray" transparent opacity={0.05} />
      </mesh>

      {/* Grid lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...boxSize)]} />
        <lineBasicMaterial color="#ffffff" />
      </lineSegments>

      {/* Box label */}
      <Text
        position={[0, boxSize[1] / 2 + 1, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {boxName}
      </Text>

      {/* Products */}
      {products.map((product) => {
        const x = startX + product.product_length / 8 + product.package_box_x / 4;
        const y = startY + product.product_height / 8 + product.package_box_y / 4;
        const z = startZ + product.product_width / 8 + product.package_box_z / 4;

        // ใช้สีจาก productColors หรือสุ่มสีใหม่หากยังไม่มี
        if (!productColors[product.product_name]) {
          const usedColors = new Set(Object.values(productColors));
          productColors[product.product_name] = getRandomColor(usedColors);
        }

        const color = productColors[product.product_name];

        return (
          <Product
            key={product.package_box_id}
            size={[product.product_length / 4, product.product_height / 4, product.product_width / 4]}
            position={[x, y, z]}
            color={color}
            name={product.product_name}
          />
        );
      })}
    </group>
  );
};

const ProductPacking = () => {
  const location = useLocation();
  const { package_dels_id, message: package_id } = (location.state as LocationState) || {};
  console.log("package_dels_id received:", package_dels_id);
  console.log("package_id received:", package_id);

  const API_URL = package_dels_id ? `http://localhost:8080/api/historydel/${package_dels_id}` : null;
  const [boxSize, setBoxSize] = useState<[number, number, number]>([0, 0, 0]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [boxName, setBoxName] = useState<string>("");
  const [productNames, setProductNames] = useState<ProductNameColor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!API_URL) {
          setLoading(false);
          return;
        }

        const response = await fetch(API_URL);
        const data: ProductData[] = await response.json();
        console.log("API data:", data);

        if (Array.isArray(data) && data.length > 0) {
          const box = data[0];
          setBoxSize([box.box_length / 4, box.box_height / 4, box.box_width / 4]);
          setBoxName(box.box_name);

          // Create unique product list for legend
          const uniqueProducts = Array.from(new Set(data.map(item => item.product_name)))
            .map(name => ({
              name,
              color: productColors[name] || "#999999",
            }));

          setProductNames(uniqueProducts);
          setProducts(data);
          console.log("Products:", data);
        } else {
          console.error("Invalid data:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-4 text-xl text-white">Loading ...</p>
      </div>
    </div>
  );

  if (!boxSize || !API_URL) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Data Error</h2>
        <p className="text-white">Failed to load package data. Please try again or contact support.</p>
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/Historydetail', { state: { message: package_id } })}
        >
          Back to History
        </button>
      </div>
    </div>
  );

  const rotation: [number, number, number] = [0, 20.5, 0];

  return (
    <div className="relative h-screen w-screen bg-gray-900">
      {/* Back button */}
      {String(package_id) !== "generate" ? (
        <button
          className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md 
                  shadow-lg transition-colors flex items-center z-10"
          onClick={() => navigate('/Historydetail', { state: { message: package_id } })}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Historydetail
        </button>
      ) : (
        <button
          className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md 
                  shadow-lg transition-colors flex items-center z-10"
          onClick={() => navigate('/History')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to History
        </button>
      )}
      {/* Box info panel */}
      <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 p-4 rounded-md shadow-lg z-10 text-white">
        <h2 className="text-xl font-bold mb-2 border-b border-gray-700 pb-2">{boxName}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">Dimensions:</span>
          <span>{boxSize[0] * 4} x {boxSize[1] * 4} x {boxSize[2] * 4}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-gray-300">Total Items:</span>
          <span>{products.length}</span>
        </div>
      </div>

      {/* Products legend */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 p-4 rounded-md shadow-lg z-10 text-white">
        <h3 className="text-lg font-bold mb-2 border-b border-gray-700 pb-2">Product</h3>
        <ul className="flex flex-wrap gap-4 justify-center">
          {productNames.map((product, index) => (
            <li key={index} className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: product.color }}></div>
              <span>{product.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Controls help */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 p-3 rounded-md shadow-lg z-10 text-white text-sm">
        <p>🖱️ Left Click + Drag: Rotate</p>
        <p>🖱️ Right Click + Drag: Pan</p>
        <p>🖱️ Scroll: Zoom</p>
        <p>🔍 Hover over product: Show details</p>
      </div>

      {/* Main 3D Canvas */}
      <Canvas
        className="w-full h-full"
        camera={{ position: [20, 12, 20], fov: 50 }}
        shadows
      >
        <color attach="background" args={["#111827"]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight
          position={[-10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          castShadow
        />

        {/* Environment */}
        <Environment preset="city" />

        {/* Box with products */}
        <Box
          boxSize={boxSize}
          products={products}
          rotation={rotation}
          boxName={boxName}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />

        {/* Grid helper */}
        <gridHelper
          args={[50, 50, '#444444', '#222222']}
          position={[0, -boxSize[1] / 2 - 0.1, 0]}
          rotation={[0, 0, 0]}
        />

        {/* Axis helper */}
        <axesHelper args={[5]} position={[0, -boxSize[1] / 2 - 0.1, 0]} />
      </Canvas>
    </div>
  );
};

export default ProductPacking;