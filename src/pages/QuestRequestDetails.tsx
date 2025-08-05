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
import { useLoaderData, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TitleBarHeader from "../components/TitleBarHeader";
import api from "../lib/api/axiosInstance";

interface Evidence {
  fileName: string;
  fileUrl: string;
  mimeType: string;
}

interface QuestRequest {
  id: number;
  code: string; // PR0000001
  challengeCode: string; // C0000003
  challengeType: 1 | 2 | 3;
  title: string;
  platform: string;
  point: number | null;
  description: string;
  evidence: Evidence[];
  relatedLink: string | null;
  fullName: string;
  email: string;
  status: 1 | 2 | 3;
  submittedDate: string;
  updatedAt?: string;
  updatedBy?: string;
  rejectedReason?: string;
}

export default function QuestRequestDetail() {
  const data = useLoaderData() as QuestRequest;
  const nav = useNavigate();

  const fmt = (d: string) => dayjs(d).format("MMM D, YYYY, HH:mm:ss");
  // const isPending = data.status === 1;
  const isApproved = data.status === 2;
  const isRejected = data.status === 3;
  const hidePoint = data.challengeType !== 1;

  const onApprove = () => {
    Modal.confirm({
      title: "Approve quest request",
      content: "Are you sure you want to approve this Quest request?",
      okText: "Approve",
      cancelText: "Cancel",
      onOk: async () => {
        await api.patch(`/api/v1/wmt/point-request/${data.id}`, { status: 2 });
        message.success("Quest request approved");
        nav(-1);
      },
    });
  };

  const onReject = () => {
    let reason = "";
    Modal.confirm({
      title: "Reject quest request",
      content: (
        <>
          <p>Please enter reason for rejection:</p>
          <textarea
            style={{ width: "100%", height: 80 }}
            onChange={(e) => (reason = e.target.value)}
          />
        </>
      ),
      okText: "Reject",
      okButtonProps: { disabled: !reason.trim() },
      cancelText: "Cancel",
      onOk: async () => {
        await api.patch(`/api/v1/wmt/point-request/${data.id}`, {
          status: 3,
          rejectedReason: reason.trim(),
        });
        message.success("Quest request rejected");
        nav(0);
      },
    });
  };

  return (
    <Page>
      <TitleBarHeader
        title="Request ID"
        actions={
          <>
            <Button onClick={onReject}>Reject</Button>
            <Button type="primary" onClick={onApprove}>
              Approve
            </Button>
          </>
        }
      />

      <Descriptions bordered column={2} size="middle">
        {/* Left column */}
        <Descriptions.Item label="Request ID">{data.code}</Descriptions.Item>
        <Descriptions.Item label="Full Name">{data.fullName}</Descriptions.Item>

        <Descriptions.Item label="Quest ID">
          {data.challengeCode}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{data.email}</Descriptions.Item>

        <Descriptions.Item label="Quest Title">{data.title}</Descriptions.Item>
        <Descriptions.Item label="Status">
          {
            {
              1: <Tag color="blue">Pending</Tag>,
              2: <Tag color="green">Approved</Tag>,
              3: <Tag color="red">Rejected</Tag>,
            }[data.status]
          }
        </Descriptions.Item>

        <Descriptions.Item label="Quest Type">
          {
            ["Common Quest", "Welcome Quest", "Tournament Quest"][
              data.challengeType - 1
            ]
          }
        </Descriptions.Item>
        <Descriptions.Item label="Submitted Date">
          {fmt(data.submittedDate)}
        </Descriptions.Item>

        <Descriptions.Item label="Platform">{data.platform}</Descriptions.Item>
        {(isApproved || isRejected) && (
          <Descriptions.Item label="Updated Date">
            {data.updatedAt ? fmt(data.updatedAt) : "-"}
          </Descriptions.Item>
        )}

        {!hidePoint && (
          <Descriptions.Item label="Point">{data.point}</Descriptions.Item>
        )}
        {(isApproved || isRejected) && data.updatedBy && (
          <Descriptions.Item label="Updated By">
            {data.updatedBy}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Description" span={2}>
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <SectionLabel>Evidence</SectionLabel>
      {data.evidence.length ? (
        <EvidenceGrid>
          {data.evidence.map((e) => (
            <Image
              key={e.fileUrl}
              src={e.fileUrl}
              width={120}
              preview={false}
              onClick={() => window.open(e.fileUrl, "_blank")}
            />
          ))}
        </EvidenceGrid>
      ) : (
        <EmptyValue>-</EmptyValue>
      )}

      <Divider />

      <SectionLabel>Related Link</SectionLabel>
      {data.relatedLink ? (
        <a href={data.relatedLink} target="_blank" rel="noreferrer">
          {data.relatedLink}
        </a>
      ) : (
        <EmptyValue>-</EmptyValue>
      )}
    </Page>
  );
}

const Page = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 8px;
`;
const EvidenceGrid = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;
const SectionLabel = styled.h4`
  margin: 16px 0 8px;
  font-weight: 600;
`;
const EmptyValue = styled.span`
  color: #999;
`;
