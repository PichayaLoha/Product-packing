import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useLocation, useNavigate } from 'react-router-dom';

const colors = ["red", "blue", "green", "yellow", "purple", "orange", "cyan", "magenta"];

const getRandomColor = (usedColors: Set<string>) => {
  let color = colors[Math.floor(Math.random() * colors.length)];
  while (usedColors.has(color)) {
    color = colors[Math.floor(Math.random() * colors.length)];
  }
  usedColors.add(color);
  return color;
};

const Product = ({ size, position, color }: { size: [number, number, number]; position: [number, number, number]; color: string }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
      <Edges color="black" />
    </mesh>
  );
};

const Box = ({ boxSize, products, rotation }: { boxSize: [number, number, number]; products: any[]; rotation: [number, number, number] }) => {
  const startX = -boxSize[0] / 2;
  const startY = -boxSize[1] / 2;
  const startZ = -boxSize[2] / 2;
  const productColors = useRef(new Map());
  const usedColors = useRef(new Set<string>()); // เพิ่ม useRef สำหรับ usedColors

  useEffect(() => {
    usedColors.current.clear(); // ล้าง usedColors เมื่อโหลดข้อมูลใหม่
  }, [products]);

  return (
    <group rotation={rotation}>
      <mesh>
        <boxGeometry args={boxSize} />
        <meshStandardMaterial color="gray" transparent opacity={0} />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...boxSize)]} />
        <lineBasicMaterial color="black" />
      </lineSegments>

      {products.map((product, index) => {
        const x = startX + product.product_length / 8 + product.package_box_x / 4;
        const y = startY + product.product_height / 8 + product.package_box_y / 4;
        const z = startZ + product.product_width / 8 + product.package_box_z / 4;

        let color = productColors.current.get(product.product_name);
        if (!color) {
          color = getRandomColor(usedColors.current); // ใช้ usedColors ใน getRandomColor
          productColors.current.set(product.product_name, color);
        }

        return (
          <Product
            key={product.package_box_id}
            size={[product.product_length / 4, product.product_height / 4, product.product_width / 4]}
            position={[x, y, z]}
            color={color}
          />
        );
      })}
    </group>
  );
};

const ProductPacking = () => {
  const location = useLocation();
  const { package_dels_id } = location.state || {};
  const { message: package_id } = location.state || {};
  console.log(" package_dels_id ที่ได้รับ:", package_dels_id);
  console.log(" package_id ที่ได้รับ:", package_id);
  const API_URL = package_dels_id ? `http://localhost:8080/api/historydel/${package_dels_id}` : null;
  const [boxSize, setBoxSize] = useState<[number, number, number] | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boxResponse = await fetch(API_URL);
        const boxData = await boxResponse.json();
        console.log("Box data:", boxData);
        if (Array.isArray(boxData) && boxData.length > 0) {
          const box = boxData[0];
          setBoxSize([box.box_length / 4, box.box_height / 4, box.box_width / 4]);
        } else {
          console.error("Invalid box data:", boxData);
        }

        const productsResponse = await fetch(API_URL);
        const productsData = await productsResponse.json();
        console.log("Products data:", productsData);
        if (Array.isArray(productsData) && productsData.length > 0) {
          setProducts(productsData);
          console.log("Products:", productsData);
        } else {
          console.error("Invalid product data:", productsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!boxSize) return <p>Failed to load box data</p>;

  const rotation = [0, 20.5, 0];

  return (
    <div style={{ position: "relative" }}>
      <button
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "gray",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={() => navigate('/Historydetail', { state: { message: package_id } })}
      >
        Back to history
      </button>
      <Canvas style={{ width: "100vw", height: "100vh" }} camera={{ position: [20, 12, 20], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Box boxSize={boxSize} products={products} rotation={rotation} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ProductPacking;