import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDChart = ({ data, xKey, yKey }) => {
  const mountRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !xKey || !yKey || data.length === 0) return;
    // Clean up previous scene
    if (chartRef.current) {
      chartRef.current.dispose();
      mountRef.current.innerHTML = '';
    }
    // Scene setup
    const width = 600;
    const height = 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    // Axes
    const xLabels = data.map(row => row[xKey]);
    const yValues = data.map(row => Number(row[yKey]));
    // Bars
    const barWidth = 0.8;
    const gap = 0.4;
    const maxY = Math.max(...yValues);
    for (let i = 0; i < yValues.length; i++) {
      const geometry = new THREE.BoxGeometry(barWidth, yValues[i], barWidth);
      const material = new THREE.MeshPhongMaterial({ color: 0x3b82f6 });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = i * (barWidth + gap);
      bar.position.y = yValues[i] / 2;
      scene.add(bar);
    }
    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    scene.add(light);
    // Camera
    camera.position.set((yValues.length * (barWidth + gap)) / 2, maxY, maxY * 2);
    camera.lookAt((yValues.length * (barWidth + gap)) / 2, 0, 0);
    // Render
    renderer.render(scene, camera);
    chartRef.current = renderer;
    // Clean up
    return () => {
      renderer.dispose();
      mountRef.current.innerHTML = '';
    };
  }, [data, xKey, yKey]);

  return (
    <div ref={mountRef} style={{ width: 600, height: 400 }} />
  );
};

export default ThreeDChart; 