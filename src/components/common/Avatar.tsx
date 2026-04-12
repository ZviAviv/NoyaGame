import { useMediaUrl } from '../../hooks/useMediaUrl';
import { CSSProperties } from 'react';

interface Props {
  avatarUrl: string;
  name: string;
  color: string;
  size: string;
  fontSize: string;
}

export default function Avatar({ avatarUrl, name, color, size, fontSize }: Props) {
  const resolvedUrl = useMediaUrl(avatarUrl);

  const placeholderStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color}, ${color}88)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  };

  const imgStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  };

  if (resolvedUrl) {
    return <img src={resolvedUrl} alt={name} style={imgStyle} />;
  }

  return <div style={placeholderStyle}>{name.charAt(0)}</div>;
}
