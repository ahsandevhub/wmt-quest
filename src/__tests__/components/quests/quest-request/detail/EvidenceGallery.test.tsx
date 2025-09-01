import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { EvidenceGallery } from "../../../../../components/quests/quest-request/detail/EvidenceGallery";
import type { Evidence } from "../../../../../types/questRequest";

// Mock styled components
vi.mock(
  "../../../../../components/quests/quest-request/detail/EvidenceGallery.styles",
  () => ({
    ImagesContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="images-container">{children}</div>
    ),
    ThumbWrapper: ({
      children,
      $loaded,
    }: {
      children: React.ReactNode;
      $loaded: boolean;
    }) => (
      <div data-testid="thumb-wrapper" data-loaded={$loaded}>
        {children}
      </div>
    ),
  })
);

// Mock Ant Design Image and Skeleton components
vi.mock("antd", () => {
  const ImageComponent = ({
    src,
    alt,
    preview,
  }: {
    src: string;
    alt: string;
    preview: boolean;
  }) => <img src={src} alt={alt} data-preview={preview} />;

  ImageComponent.PreviewGroup = ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="preview-group">{children}</div>;

  return {
    Image: ImageComponent,
    Skeleton: {
      Image: ({
        style,
        active,
      }: {
        style?: React.CSSProperties;
        active?: boolean;
      }) => (
        <div data-testid="skeleton-image" style={style} data-active={active}>
          Loading...
        </div>
      ),
    },
  };
});

describe("EvidenceGallery", () => {
  const mockEvidence: Evidence[] = [
    {
      fileUrl: "https://example.com/image1.jpg",
      fileName: "evidence1.jpg",
      mimeType: "image/jpeg",
    },
    {
      fileUrl: "https://example.com/image2.png",
      fileName: "evidence2.png",
      mimeType: "image/png",
    },
  ];

  it("renders a dash when evidence array is empty", () => {
    render(<EvidenceGallery evidence={[]} />);

    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.queryByTestId("preview-group")).not.toBeInTheDocument();
  });

  it("renders a dash when evidence is null", () => {
    render(<EvidenceGallery evidence={null as any} />);

    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.queryByTestId("preview-group")).not.toBeInTheDocument();
  });

  it("renders a dash when evidence is undefined", () => {
    render(<EvidenceGallery evidence={undefined as any} />);

    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.queryByTestId("preview-group")).not.toBeInTheDocument();
  });

  it("renders preview group and images container when evidence exists", () => {
    render(<EvidenceGallery evidence={mockEvidence} />);

    expect(screen.getByTestId("preview-group")).toBeInTheDocument();
    expect(screen.getByTestId("images-container")).toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
  });

  it("renders correct number of thumbnail wrappers", () => {
    render(<EvidenceGallery evidence={mockEvidence} />);

    const thumbWrappers = screen.getAllByTestId("thumb-wrapper");
    expect(thumbWrappers).toHaveLength(mockEvidence.length);
  });

  it("renders images with correct src and alt attributes", () => {
    render(<EvidenceGallery evidence={mockEvidence} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(mockEvidence.length);

    images.forEach((img, index) => {
      expect(img).toHaveAttribute("src", mockEvidence[index].fileUrl);
      expect(img).toHaveAttribute("alt", mockEvidence[index].fileName);
    });
  });

  it("handles single evidence item correctly", () => {
    const singleEvidence = [mockEvidence[0]];
    render(<EvidenceGallery evidence={singleEvidence} />);

    expect(screen.getByTestId("preview-group")).toBeInTheDocument();
    expect(screen.getAllByTestId("thumb-wrapper")).toHaveLength(1);
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
  it("uses fileUrl as key for mapping", () => {
    render(<EvidenceGallery evidence={mockEvidence} />);

    const thumbWrappers = screen.getAllByTestId("thumb-wrapper");
    // Each thumb wrapper should be rendered (one per evidence item)
    expect(thumbWrappers).toHaveLength(2);
  });
});
