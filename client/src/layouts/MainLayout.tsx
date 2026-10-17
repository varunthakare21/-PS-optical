import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnnouncementBar from '../components/layout/AnnouncementBar';

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F6F1E8' }}>
      <AnnouncementBar />
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ flex: 1 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
