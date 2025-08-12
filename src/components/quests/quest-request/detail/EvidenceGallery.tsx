import { Image, Skeleton } from "antd";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import type { QuestRequest } from "../../../../types/questRequest";

const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  width: 100%;
`;

const ThumbWrapper = styled.div<{ $loaded: boolean }>`
  width: 200px;
  max-width: 100%;
  position: relative;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  .fade-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #fff;
    opacity: ${(p) => (p.$loaded ? 1 : 0)};
    transition: opacity 0.35s ease;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

interface ProgressiveThumbProps {
  fileUrl: string;
  fileName: string;
}

const ProgressiveThumb: React.FC<ProgressiveThumbProps> = ({
  fileUrl,
  fileName,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);

  const prefetch = useCallback(() => {
    if (typeof document === "undefined") return;
    const img = document.createElement("img");
    img.src = fileUrl;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setRatio(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [fileUrl]);

  useState(() => {
    prefetch();
    return undefined;
  });

  const aspectStyle = ratio ? { aspectRatio: `${ratio}` } : undefined;

  return (
    <ThumbWrapper $loaded={loaded} style={aspectStyle}>
      <Image
        src={fileUrl}
        alt={fileName}
        width={200}
        placeholder={
          <Skeleton.Image
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: ratio ? `${ratio}` : undefined,
            }}
            active
          />
        }
        fallback={fileUrl}
        onLoad={() => setLoaded(true)}
        preview={{ mask: fileName || "Preview" }}
        className="fade-img"
      />
    </ThumbWrapper>
  );
};

export const EvidenceGallery: React.FC<{
  evidence: QuestRequest["evidence"];
}> = ({ evidence }) => {
  if (!evidence?.length) return <span>-</span>;
  return (
    <Image.PreviewGroup>
      <ImagesContainer>
        {evidence.map((e) => (
          <ProgressiveThumb
            key={e.fileUrl}
            fileUrl={e.fileUrl}
            fileName={e.fileName}
          />
        ))}
      </ImagesContainer>
    </Image.PreviewGroup>
  );
};
