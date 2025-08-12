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
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, useRevalidator } from "react-router-dom";
import styled from "styled-components";
<<<<<<< HEAD:src/containers/quests/QuestRequestDetailContainer.tsx
import TitleBarHeader from "../../components/common/TitleBarHeader";
import api from "../../services/http";

import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import {
  QuestRequestStatus,
  type QuestRequestStatusEnum,
  QuestRequestStatusLabels,
} from "../../types/questRequestStatus";
import {
  QuestType,
  type QuestTypeEnum,
  QuestTypeLabels,
} from "../../types/questType";
=======
import TitleBarHeader from "../components/TitleBarHeader";
import api from "../lib/api/axiosInstance";
import {
  QuestRequestStatus,
  type QuestRequestStatusEnum,
} from "../types/questRequestStatus";
import { QuestType, type QuestTypeEnum } from "../types/questType";
>>>>>>> 96ba1770cf821f161fafd983f790e6759aff38b6:src/pages/QuestRequestDetails.tsx

interface Evidence {
  fileName: string;
  fileUrl: string;
  mimeType: string;
}

interface QuestRequest {
  id: number;
  code: string;
  challengeCode: string;
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
  const { t } = useTranslation("quest_request_detail");
  const { revalidate } = useRevalidator();

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const QuestTypeLabels: Record<QuestTypeEnum, string> = {
    [QuestType.Common]: t("labels.questType"),
    [QuestType.Welcome]: t("questType.welcome"),
    [QuestType.Tournament]: t("questType.tournament"),
  };

  const QuestRequestStatusLabels: Record<QuestRequestStatusEnum, string> = {
    [QuestRequestStatus.Pending]: t("questRequestStatus.pending"),
    [QuestRequestStatus.Approved]: t("questRequestStatus.approved"),
    [QuestRequestStatus.Rejected]: t("questRequestStatus.rejected"),
  };

  const handleApprove = async () => {
    try {
      await api.post(`/api/v1/wmt/point-request/${data.id}/approved`);
      message.success(t("messages.approveSuccess"));
      setIsApproveModalOpen(false);
      revalidate();
    } catch {
      message.error(t("messages.approveError"));
    }
  };

  const handleReject = async () => {
    try {
      await api.post(`/api/v1/wmt/point-request/${data.id}/rejected`, {
        rejectedReason: rejectReason.trim(),
      });
      message.success(t("messages.rejectSuccess"));
      setIsRejectModalOpen(false);
      revalidate();
    } catch {
      message.error(t("messages.rejectError"));
    }
  };

  return (
    <PageWrapper>
      <TitleBarHeader
        title={data.code}
        actions={
          data.status === QuestRequestStatus.Pending && (
            <>
              <Button onClick={() => setIsRejectModalOpen(true)}>
                {t("buttons.reject")}
              </Button>
              <Button
                type="primary"
                onClick={() => setIsApproveModalOpen(true)}
              >
                {t("buttons.approve")}
              </Button>
            </>
          )
        }
      />

      <DescriptionsWrappper>
        <StyledDescriptions
          column={1}
          layout="horizontal"
          colon={false}
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label={t("labels.requestId")}>
            {data.code}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.questId")}>
            {data.challengeCode}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.questTitle")}>
            {data.title}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.questType")}>
            {QuestTypeLabels[data.challengeType]}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.platform")}>
            {data.platform}
          </Descriptions.Item>

          {data.challengeType === QuestType.Common && (
            <Descriptions.Item label={t("labels.point")}>
              {data.point?.toLocaleString() || "-"}
            </Descriptions.Item>
          )}

          <Descriptions.Item label={t("labels.description")} span={2}>
            {data.description}
          </Descriptions.Item>
        </StyledDescriptions>

        <StyledDescriptions
          column={1}
          layout="horizontal"
          colon={false}
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label={t("labels.fullName")}>
            {data.fullName}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.email")}>
            {data.email}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.status")}>
            <Tag color={statusColor[data.status]}>
              {QuestRequestStatusLabels[data.status]}
            </Tag>
          </Descriptions.Item>

          {data.status === QuestRequestStatus.Rejected && (
            <Descriptions.Item label={t("labels.rejectedReason")}>
              {data.rejectedReason}
            </Descriptions.Item>
          )}

          <Descriptions.Item label={t("labels.submittedDate")}>
            {dayjs(data.submittedDate).format("MM/DD/YYYY hh:mm:ss")}
          </Descriptions.Item>

          {(data.status === QuestRequestStatus.Approved ||
            data.status === QuestRequestStatus.Rejected) && (
            <>
              <Descriptions.Item label={t("labels.updatedDate")}>
                {dayjs(data.updatedAt).format("MM/DD/YYYY hh:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label={t("labels.updatedBy")}>
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
        <Descriptions.Item label={t("labels.evidence")}>
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

        <Descriptions.Item label={t("labels.relatedLink")}>
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

      {/* Approve Modal */}
      <Modal
        title={t("modals.approveTitle")}
        open={isApproveModalOpen}
        onOk={handleApprove}
        onCancel={() => setIsApproveModalOpen(false)}
        okText={t("buttons.approve")}
        cancelText={t("buttons.cancel")}
        closable
      >
        <p>{t("modals.approveConfirm")}</p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title={t("modals.rejectTitle")}
        open={isRejectModalOpen}
        onOk={handleReject}
        onCancel={() => setIsRejectModalOpen(false)}
        okText={t("buttons.reject")}
        cancelText={t("buttons.cancel")}
        closable
        okButtonProps={{ disabled: !rejectReason.trim() }}
      >
        <p style={{ marginBottom: 4 }}>
          <span style={{ color: "red", marginRight: 4 }}>*</span>
          <span>{t("labels.rejectedReason")}</span>
        </p>
        <TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={2}
          maxLength={250}
          required
          placeholder={t("modals.rejectPlaceholder")}
        />
      </Modal>
    </PageWrapper>
  );
}
