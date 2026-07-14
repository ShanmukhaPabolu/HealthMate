import React from 'react';

export const SkeletonText = ({ width = '100%', height = '16px', marginBottom = '8px' }) => (
  <div className="skeleton skeleton-text" style={{ width, height, marginBottom }} />
);

export const SkeletonTitle = ({ width = '60%', height = '28px', marginBottom = '16px' }) => (
  <div className="skeleton skeleton-title" style={{ width, height, marginBottom }} />
);

export const SkeletonCard = ({ height = '160px' }) => (
  <div className="skeleton skeleton-card" style={{ height }} />
);

export const SkeletonAvatar = ({ size = '48px' }) => (
  <div className="skeleton skeleton-avatar" style={{ width: size, height: size }} />
);

export const SkeletonButton = ({ width = '140px', height = '44px' }) => (
  <div className="skeleton skeleton-btn" style={{ width, height }} />
);

export const SkeletonList = ({ items = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'white', borderRadius: '12px' }}>
        <SkeletonAvatar size="40px" />
        <div style={{ flex: 1 }}>
          <SkeletonText width="40%" height="14px" />
          <SkeletonText width="70%" height="12px" marginBottom="0" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonGrid = ({ cards = 6 }) => (
  <div className="grid-auto">
    {Array.from({ length: cards }).map((_, i) => (
      <div key={i} className="card card-sm">
        <SkeletonAvatar size="48px" />
        <div style={{ marginTop: '16px' }}>
          <SkeletonTitle width="50%" height="20px" />
          <SkeletonText width="90%" />
          <SkeletonText width="80%" />
        </div>
      </div>
    ))}
  </div>
);
