import { render, screen } from "@testing-library/react";
import { StatusTag } from "../../../../../components/quests/quest-request/detail/StatusTag";
import { QuestRequestStatus } from "../../../../../types/questRequestStatus";

describe("StatusTag", () => {
  it("renders pending status with blue color", () => {
    render(<StatusTag status={QuestRequestStatus.Pending} label="Pending" />);

    const tag = screen.getByText("Pending");
    expect(tag).toBeInTheDocument();
    expect(tag.closest(".ant-tag")).toHaveClass("ant-tag-blue");
  });

  it("renders approved status with green color", () => {
    render(<StatusTag status={QuestRequestStatus.Approved} label="Approved" />);

    const tag = screen.getByText("Approved");
    expect(tag).toBeInTheDocument();
    expect(tag.closest(".ant-tag")).toHaveClass("ant-tag-green");
  });

  it("renders rejected status with red color", () => {
    render(<StatusTag status={QuestRequestStatus.Rejected} label="Rejected" />);

    const tag = screen.getByText("Rejected");
    expect(tag).toBeInTheDocument();
    expect(tag.closest(".ant-tag")).toHaveClass("ant-tag-red");
  });

  it("displays the provided label text", () => {
    render(
      <StatusTag
        status={QuestRequestStatus.Pending}
        label="Custom Status Text"
      />
    );

    expect(screen.getByText("Custom Status Text")).toBeInTheDocument();
  });
});
