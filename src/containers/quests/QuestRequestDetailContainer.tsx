// Quest Request Detail Page
import { Descriptions, Divider, message, Modal, Skeleton } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, useRevalidator } from "react-router-dom";
import TitleBarHeader from "../../components/common/layout/TitleBarHeader";
import { ActionButtons } from "../../components/quests/quest-request/detail/ActionButtons";
import { EvidenceGallery } from "../../components/quests/quest-request/detail/EvidenceGallery";
import { RelatedLink } from "../../components/quests/quest-request/detail/RelatedLink";
import { StatusTag } from "../../components/quests/quest-request/detail/StatusTag";
import {
  getQuestRequestStatusLabel,
  getQuestTypeLabel,
} from "../../constants/labels";
import { namespaces } from "../../i18n/namespaces";
import {
  approveQuestRequest,
  rejectQuestRequest,
} from "../../services/quests/questRequest.service";
import type { QuestRequest } from "../../types/questRequest";
import { QuestRequestStatus } from "../../types/questRequestStatus";
import { QuestType } from "../../types/questType";
import { formatDate } from "../../utils/format";
import {
  DescriptionsWrappper,
  InfoColumn,
  PageWrapper,
} from "./QuestRequestDetailContainer.styles";

export default function QuestRequestDetail() {
  const data = useLoaderData() as QuestRequest;
  const { t } = useTranslation(namespaces.questRequestDetail);
  const { t: tLabels } = useTranslation(namespaces.labels);
  const { revalidate } = useRevalidator();

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<null | "approve" | "reject">(
    null
  );

  // Memoized labels (avoid re-computing objects every render)
  const questTypeLabel = useMemo(
    () => getQuestTypeLabel(data.challengeType, tLabels),
    [data.challengeType, tLabels]
  );
  const statusLabel = useMemo(
    () => getQuestRequestStatusLabel(data.status, tLabels),
    [data.status, tLabels]
  );

  const handleApprove = useCallback(async () => {
    try {
      setIsSubmitting("approve");
      await approveQuestRequest(data.id);
      message.success(t("messages.approveSuccess"));
      setIsApproveModalOpen(false);
      revalidate();
    } catch {
      message.error(t("messages.approveError"));
    } finally {
      setIsSubmitting(null);
    }
  }, [data.id, revalidate, t]);

  const handleReject = useCallback(async () => {
    try {
      setIsSubmitting("reject");
      await rejectQuestRequest(data.id, rejectReason);
      message.success(t("messages.rejectSuccess"));
      setIsRejectModalOpen(false);
      revalidate();
    } catch {
      message.error(t("messages.rejectError"));
    } finally {
      setIsSubmitting(null);
    }
  }, [data.id, rejectReason, revalidate, t]);

  if (!data) return <Skeleton active />; // Guard (shouldn't happen)

  return (
    <PageWrapper>
      <TitleBarHeader
        title={data.code}
        actions={
          <ActionButtons
            show={data.status === QuestRequestStatus.Pending}
            loadingAction={isSubmitting}
            onReject={() => setIsRejectModalOpen(true)}
            onApprove={() => setIsApproveModalOpen(true)}
            approveLabel={t("buttons.approve")}
            rejectLabel={t("buttons.reject")}
          />
        }
      />

      <DescriptionsWrappper>
        <InfoColumn bordered={false} column={1}>
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
            {questTypeLabel}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.platform")}>
            {data.platform}
          </Descriptions.Item>

          {data.challengeType === QuestType.Common && (
            <Descriptions.Item label={t("labels.point")}>
              {data.point?.toLocaleString() || "-"}
            </Descriptions.Item>
          )}
        </InfoColumn>
        <InfoColumn bordered={false} column={1}>
          <Descriptions.Item label={t("labels.fullName")}>
            {data.fullName}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.email")}>
            {data.email}
          </Descriptions.Item>

          <Descriptions.Item label={t("labels.status")}>
            <StatusTag status={data.status} label={statusLabel} />
          </Descriptions.Item>

          {data.status === QuestRequestStatus.Rejected && (
            <Descriptions.Item label={t("labels.rejectedReason")}>
              {data.rejectedReason}
            </Descriptions.Item>
          )}

          <Descriptions.Item label={t("labels.submittedDate")}>
            {formatDate(data.submittedDate)}
          </Descriptions.Item>

          {(data.status === QuestRequestStatus.Approved ||
            data.status === QuestRequestStatus.Rejected) && (
            <>
              <Descriptions.Item label={t("labels.updatedDate")}>
                {formatDate(data.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label={t("labels.updatedBy")}>
                {data.updatedBy}
              </Descriptions.Item>
            </>
          )}
        </InfoColumn>
      </DescriptionsWrappper>
      <Descriptions bordered={false} column={1} style={{ marginBottom: 24 }}>
        <Descriptions.Item label={t("labels.description")}>
          {data.description}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: "16px 0 24px" }} />

      <Descriptions bordered={false} column={1} style={{ marginBottom: 24 }}>
        <Descriptions.Item label={t("labels.evidence")}>
          <EvidenceGallery evidence={data.evidence} />
        </Descriptions.Item>

        <Descriptions.Item label={t("labels.relatedLink")}>
          <RelatedLink url={data.relatedLink} />
        </Descriptions.Item>
      </Descriptions>

      {/* Approve Modal */}
      <Modal
        title={t("modals.approveTitle")}
        open={isApproveModalOpen}
        onOk={handleApprove}
        onCancel={() => setIsApproveModalOpen(false)}
        okText={t("buttons.approve")}
        cancelText={t("buttons.cancel")}
        closable
        confirmLoading={isSubmitting === "approve"}
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
        okButtonProps={{
          disabled: !rejectReason.trim(),
          loading: isSubmitting === "reject",
        }}
        confirmLoading={isSubmitting === "reject"}
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
