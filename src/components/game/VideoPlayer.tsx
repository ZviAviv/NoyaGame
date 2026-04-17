import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { CSSProperties, useState } from 'react';
import { useMediaUrl } from '../../hooks/useMediaUrl';

interface Props {
  videoUrl: string;
  onEnd: () => void;
}

export default function VideoPlayer({ videoUrl, onEnd }: Props) {
  const resolvedVideoUrl = useMediaUrl(videoUrl);
  const hasVideo = resolvedVideoUrl && resolvedVideoUrl.trim() !== '';
  const [isVertical, setIsVertical] = useState(false);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setIsVertical(video.videoHeight > video.videoWidth);
  };

  return (
    <motion.div
      style={overlayStyle}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <div style={playerContainerStyle}>
        {hasVideo ? (
          <video
            src={resolvedVideoUrl}
            style={isVertical ? verticalVideoStyle : videoStyle}
            autoPlay
            onEnded={onEnd}
            onLoadedMetadata={handleMetadata}
            controls={false}
          />
        ) : (
          <div style={placeholderStyle}>
            <motion.span
              style={{ fontSize: '4rem' }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎬
            </motion.span>
            <p style={{ fontFamily: theme.fonts.heading, fontSize: '1.3rem', marginTop: '1rem' }}>
              הסרטון בקרוב...
            </p>
            <p style={{ color: theme.colors.textSecondary, marginTop: '0.5rem' }}>
              📹 הסרטון יתווסף בקרוב
            </p>
          </div>
        )}

        <motion.button
          style={continueButtonStyle}
          onClick={onEnd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: hasVideo ? 0 : 1.5 }}
        >
          המשך ←
        </motion.button>
      </div>
    </motion.div>
  );
}

const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(10, 5, 30, 0.92)',
  zIndex: 20,
  backdropFilter: 'blur(8px)',
};

const playerContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
  maxWidth: '700px',
  width: '90%',
};

const videoStyle: CSSProperties = {
  width: '100%',
  borderRadius: theme.borderRadius.lg,
  border: `2px solid ${theme.colors.cardBorder}`,
  boxShadow: `0 8px 40px rgba(0, 0, 0, 0.5)`,
};

const verticalVideoStyle: CSSProperties = {
  maxHeight: '65vh',
  maxWidth: '100%',
  width: 'auto',
  borderRadius: theme.borderRadius.lg,
  border: `2px solid ${theme.colors.cardBorder}`,
  boxShadow: `0 8px 40px rgba(0, 0, 0, 0.5)`,
  display: 'block',
};

const placeholderStyle: CSSProperties = {
  background: theme.colors.cardBg,
  border: `2px solid ${theme.colors.cardBorder}`,
  borderRadius: theme.borderRadius.lg,
  padding: '4rem 3rem',
  textAlign: 'center',
  width: '100%',
};

const continueButtonStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '1.1rem',
  background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldDark})`,
  color: '#1a0a2e',
  border: 'none',
  borderRadius: theme.borderRadius.pill,
  padding: '0.7rem 2rem',
  cursor: 'pointer',
};
