// src/routes/point-request/$pointRequestId.tsx
import {
  Button,
  Descriptions,
  Divider,
  Image,
  Modal,
  Tag,
  message,
} from "antd";
import dayjs from "dayjs";
import { useLoaderData, useRevalidator } from "react-router-dom";
import styled from "styled-components";
import TitleBarHeader from "../components/TitleBarHeader";
import api from "../lib/api/axiosInstance";

import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import {
  QuestRequestStatus,
  type QuestRequestStatusEnum,
  QuestRequestStatusLabels,
} from "../types/questRequestStatus";
import {
  QuestType,
  type QuestTypeEnum,
  QuestTypeLabels,
} from "../types/questType";

interface Evidence {
  fileName: string;
  fileUrl: string;
  mimeType: string;
}

interface QuestRequest {
  id: number;
  code: string; // PR0000001
  challengeCode: string; // C0000003
  challengeType: QuestTypeEnum;
  title: string;
  platform: string;
  point: number | null;
  description: string;
  evidence: Evidence[];
  relatedLink: string | null;
  fullName: string;
  email: string;
  status: QuestRequestStatusEnum;
  submittedDate: string;
  updatedAt?: string;
  updatedBy?: string;
  rejectedReason?: string;
}

const PageWrapper = styled.div`
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #0000000f;
  border-radius: 0.5rem;
`;

const DescriptionsWrappper = styled.div`
  display: flex;
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const ImageWrapper = styled.div`
  cursor: pointer;
`;

const StyledLink = styled.a`
  color: #1890ff;
  text-decoration: underline;
`;

const StyledDescriptions = styled(Descriptions)`
  && {
    .ant-descriptions-item-label {
      font-weight: 600;
      color: #000000e0;
      width: 200px;
    }
    .ant-descriptions-item-content {
      font-size: 14px;
    }
  }
`;

const statusColor: Record<QuestRequestStatusEnum, string> = {
  [QuestRequestStatus.Pending]: "blue",
  [QuestRequestStatus.Approved]: "green",
  [QuestRequestStatus.Rejected]: "red",
};

export default function QuestRequestDetail() {
  const data = useLoaderData() as QuestRequest;
  const { revalidate } = useRevalidator();

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async () => {
    try {
      await api.post(`/api/v1/wmt/point-request/${data.id}/approved`);
      message.success("Approve the quest request successfully!");
      setIsApproveModalOpen(false);
      revalidate();
    } catch {
      message.error("Failed to approve. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      await api.post(`/api/v1/wmt/point-request/${data.id}/rejected`, {
        rejectedReason: rejectReason.trim(),
      });
      message.success("Reject the quest request successfully!");
      setIsRejectModalOpen(false);
      revalidate();
    } catch {
      message.error("Failed to reject. Please try again.");
    }
  };

  return (
    <PageWrapper>
      <TitleBarHeader
        title={data.code}
        actions={
          data.status === QuestRequestStatus.Pending && (
            <>
              <Button onClick={() => setIsRejectModalOpen(true)}>Reject</Button>
              <Button
                type="primary"
                onClick={() => setIsApproveModalOpen(true)}
              >
                Approve
              </Button>
            </>
          )
        }
      />

      <DescriptionsWrappper>
        {/* Left column */}
        <StyledDescriptions
          column={1}
          layout="horizontal"
          colon={false}
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="Request ID">{data.code}</Descriptions.Item>

          <Descriptions.Item label="Quest ID">
            {data.challengeCode}
          </Descriptions.Item>

          <Descriptions.Item label="Quest Title">
            {data.title}
          </Descriptions.Item>

          <Descriptions.Item label="Quest Type">
            {QuestTypeLabels[data.challengeType]}
          </Descriptions.Item>

          <Descriptions.Item label="Platform">
            {data.platform}
          </Descriptions.Item>

          {data.challengeType === QuestType.Common && (
            <Descriptions.Item label="Point">
              {data.point?.toLocaleString() || "-"}
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Description" span={2}>
            {data.description}
          </Descriptions.Item>
        </StyledDescriptions>

        {/* Right column */}
        <StyledDescriptions
          column={1}
          layout="horizontal"
          colon={false}
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="Full Name">
            {data.fullName}
          </Descriptions.Item>

          <Descriptions.Item label="Email">{data.email}</Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={statusColor[data.status]}>
              {QuestRequestStatusLabels[data.status]}
            </Tag>
          </Descriptions.Item>

          {/* Rejected reason: only for status Rejected */}
          {data.status === QuestRequestStatus.Rejected && (
            <Descriptions.Item label="Rejected Reason">
              {data.rejectedReason}
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Submitted Date">
            {dayjs(data.submittedDate).format("MM/DD/YYYY hh:mm:ss")}
          </Descriptions.Item>

          {/* Updated Date & Updated By: only for Approved or Rejected */}
          {(data.status === QuestRequestStatus.Approved ||
            data.status === QuestRequestStatus.Rejected) && (
            <>
              <Descriptions.Item label="Updated Date">
                {dayjs(data.updatedAt).format("MM/DD/YYYY hh:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Updated By">
                {data.updatedBy}
              </Descriptions.Item>
            </>
          )}
        </StyledDescriptions>
      </DescriptionsWrappper>

      <Divider />

      <StyledDescriptions
        column={1}
        layout="horizontal"
        colon={false}
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Evidence">
          {data.evidence.length > 0 ? (
            <ImagesContainer>
              {data.evidence.map((e) => (
                <ImageWrapper
                  key={e.fileUrl}
                  onClick={() => window.open(e.fileUrl, "_blank")}
                >
                  <Image preview={false} src={e.fileUrl} width={200} />
                </ImageWrapper>
              ))}
            </ImagesContainer>
          ) : (
            <span>-</span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Related Link">
          {data.relatedLink ? (
            <StyledLink
              href={data.relatedLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.relatedLink}
            </StyledLink>
          ) : (
            <span>-</span>
          )}
        </Descriptions.Item>
      </StyledDescriptions>

      {/* --- APPROVE MODAL --- */}
      <Modal
        title="Approve Quest Request"
        open={isApproveModalOpen}
        onOk={handleApprove}
        onCancel={() => setIsApproveModalOpen(false)}
        okText="Approve"
        cancelText="Cancel"
        closable
      >
        <p>Are you sure you want to approve this quest request?</p>
      </Modal>

      {/* --- REJECT MODAL --- */}
      <Modal
        title="Reject Quest Request"
        open={isRejectModalOpen}
        onOk={handleReject}
        onCancel={() => setIsRejectModalOpen(false)}
        okText="Reject"
        cancelText="Cancel"
        closable
        okButtonProps={{ disabled: !rejectReason.trim() }}
      >
        <p style={{ marginBottom: 4 }}>
          <span style={{ color: "red", marginRight: 4 }}>*</span>
          <span>Reject Reason</span>
        </p>

        <TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={2}
          maxLength={250}
          required
          placeholder="Type a reason…"
        />
      </Modal>
    </PageWrapper>
  );
}
