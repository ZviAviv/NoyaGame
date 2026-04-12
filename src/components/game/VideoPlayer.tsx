import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { CSSProperties } from 'react';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import Avatar from '../common/Avatar';

interface Props {
  videoUrl: string;
  personName?: string;
  personEmoji?: string;
  personAvatarUrl?: string;
  personColor?: string;
  onEnd: () => void;
}

export default function VideoPlayer({ videoUrl, personName, personAvatarUrl, personColor, onEnd }: Props) {
  const resolvedVideoUrl = useMediaUrl(videoUrl);
  const hasVideo = resolvedVideoUrl && resolvedVideoUrl.trim() !== '';

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
            style={videoStyle}
            autoPlay
            onEnded={onEnd}
            controls={false}
          />
        ) : (
          <div style={placeholderStyle}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {personName ? (
                <Avatar avatarUrl={personAvatarUrl || ''} name={personName} color={personColor || '#888'} size="5rem" fontSize="2rem" />
              ) : (
                <span style={{ fontSize: '4rem' }}>🎬</span>
              )}
            </motion.div>
            <p style={{ fontFamily: theme.fonts.heading, fontSize: '1.3rem', marginTop: '1rem' }}>
              {personName ? `הסרטון של ${personName}` : 'הסרטון בקרוב...'}
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
