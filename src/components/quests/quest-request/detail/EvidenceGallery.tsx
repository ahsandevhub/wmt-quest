import { Image, Skeleton } from "antd";
import React, { useState } from "react";
import type { QuestRequest } from "../../../../types/questRequest";
import { ImagesContainer, ThumbWrapper } from "./EvidenceGallery.styles";

interface ProgressiveThumbProps {
  fileUrl: string;
  fileName: string;
}

const ProgressiveThumb: React.FC<ProgressiveThumbProps> = ({
  fileUrl,
  fileName,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <ThumbWrapper $loaded={loaded}>
      <Image
        src={fileUrl}
        alt={fileName}
        width={200}
        height={200}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        placeholder={
          <div style={{ width: "100%", height: "100%" }}>
            <Skeleton.Image
              style={{ width: "100%", height: "100%" }}
              active
              className="placeholder-cover"
            />
          </div>
        }
        fallback={fileUrl}
        onLoad={() => setLoaded(true)}
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
