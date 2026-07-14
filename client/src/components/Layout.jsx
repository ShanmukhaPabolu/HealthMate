import React from 'react';
import { Outlet } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import LoadingScreen from './LoadingScreen';

const Layout = () => {
  return (
    <>
      <ParticlesBackground />
      <LoadingScreen text="HealthMate" subtitle="Your Unified Health Hub" />
      <Outlet />
    </>
  );
};

export default Layout;
