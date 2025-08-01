// src/pages/UpdateQuest.tsx
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Layout,
  message,
  Select,
  Switch,
  Table,
  Typography,
} from "antd";
import type { AxiosError } from "axios";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../lib/api";

const { Content } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

interface QuestData {
  id: number;
  status: boolean;
  title: string;
  expiryDate: string | null;
  platform: number;
  point: number;
  accountRank: number[];
  requiredUploadEvidence: boolean;
  requiredEnterLink: boolean;
  allowSubmitMultiple: boolean;
  description: string;
  userEmails: UserEmail[];
}

interface UserEmail {
  id: number;
  email: string;
  fullName: string;
}

interface UpdateQuestFormValues {
  status: boolean;
  title: string;
  expiryDate?: Dayjs;
  platform?: number;
  point: number;
  accountRank: number[];
  requiredUploadEvidence: boolean;
  requiredEnterLink: boolean;
  allowSubmitMultiple: boolean;
  description: string;
  specificEmail?: string;
}

// styled components
const PageWrapper = styled.div`
  padding: 24px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  cursor: pointer;

  & .anticon {
    color: #595959;
    font-size: 18px;
  }
  & span {
    font-size: 16px;
    font-weight: 500;
    color: #262626;
  }
`;

const FormContainer = styled(Content)`
  max-width: 1000px;
  width: 100%;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SearchInput = styled(Input)`
  width: 300px;
`;

const SpecificEmailInput = styled(Input)`
  width: 70%;
`;

// main component
export default function UpdateQuest() {
  const navigate = useNavigate();
  const quest = useLoaderData() as QuestData;
  const [form] = Form.useForm<UpdateQuestFormValues>();
  const [emailList, setEmailList] = useState<UserEmail[]>(quest.userEmails);
  const [filteredEmails, setFilteredEmails] = useState<UserEmail[]>(
    quest.userEmails
  );
  const [searchTerm, setSearchTerm] = useState("");

  // prepare form values
  useEffect(() => {
    form.setFieldsValue({
      status: quest.status,
      title: quest.title,
      expiryDate: quest.expiryDate ? dayjs(quest.expiryDate) : undefined,
      platform: quest.platform,
      point: quest.point,
      accountRank: quest.accountRank,
      requiredUploadEvidence: quest.requiredUploadEvidence,
      requiredEnterLink: quest.requiredEnterLink,
      allowSubmitMultiple: quest.allowSubmitMultiple,
      description: quest.description,
      specificEmail: "",
    });
  }, [form, quest]);

  // 2️⃣ Filter email list
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    setFilteredEmails(
      emailList.filter(
        (u) =>
          u.email.toLowerCase().includes(term) ||
          u.fullName.toLowerCase().includes(term)
      )
    );
  }, [emailList, searchTerm]);

  // 3️⃣ Handlers
  const handleAddEmail = () => {
    const email = form.getFieldValue("specificEmail");
    if (email) {
      setEmailList((prev) => [
        ...prev,
        { id: Date.now(), email, fullName: email },
      ]);
      form.setFieldValue("specificEmail", "");
    }
  };

  const handleImport = () => {
    message.info("Import clicked");
  };

  const handleDelete = (uid: number) =>
    setEmailList((prev) => prev.filter((u) => u.id !== uid));

  // 4️⃣ Submit update
  const onFinish = async (vals: UpdateQuestFormValues) => {
    try {
      await api.put(`/api/v1/wmt/quest/${quest.id}`, {
        title: vals.title,
        description: vals.description,
        status: vals.status,
        point: Number(vals.point),
        platform: vals.platform ?? 0,
        accountRank: vals.accountRank,
        requiredUploadEvidence: vals.requiredUploadEvidence,
        requiredEnterLink: vals.requiredEnterLink,
        allowSubmitMultiple: vals.allowSubmitMultiple,
        expiryDate: vals.expiryDate?.toISOString() ?? null,
        userIds: emailList.map((u) => u.id),
      });
      message.success("Quest updated successfully");
      navigate(-1);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      message.error(error.response?.data?.message ?? "Failed to update quest");
    }
  };

  return (
    <PageWrapper>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeftOutlined />
        <span>Edit Quest</span>
      </BackButton>

      <FormContainer>
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          colon={false}
          labelCol={{ flex: "0 0 300px" }}
          wrapperCol={{ flex: "1 1 auto" }}
          onFinish={onFinish}
        >
          <Form.Item
            name="status"
            label={<Text>Active&nbsp;:</Text>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="title"
            label={<Text>Title&nbsp;:</Text>}
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Enter Title" />
          </Form.Item>

          <Form.Item name="expiryDate" label={<Text>Expiry Date&nbsp;:</Text>}>
            <DatePicker style={{ width: "100%" }} placeholder="Select date" />
          </Form.Item>

          <Form.Item name="platform" label={<Text>Platform&nbsp;:</Text>}>
            <Select placeholder="Select">
              {[
                "Other",
                "Facebook",
                "Instagram",
                "YouTube",
                "Telegram",
                "TikTok",
                "Twitter",
                "Discord",
              ].map((label, idx) => (
                <Select.Option key={idx} value={idx}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="point"
            label={<Text>Point&nbsp;:</Text>}
            rules={[{ required: true, message: "Please enter point" }]}
          >
            <Input type="number" placeholder="Enter Point" />
          </Form.Item>

          <Form.Item
            name="accountRank"
            label={<Text>Account Ranks&nbsp;:</Text>}
            rules={[{ required: true, message: "Select at least one rank" }]}
          >
            <Checkbox.Group>
              <Checkbox value={1}>Silver</Checkbox>
              <Checkbox value={2}>Gold</Checkbox>
              <Checkbox value={3}>Diamond</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="requiredUploadEvidence"
            label={<Text>Required Upload Image&nbsp;:</Text>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="requiredEnterLink"
            label={<Text>Required Enter Link&nbsp;:</Text>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="allowSubmitMultiple"
            label={<Text>Allow Multiple Submission&nbsp;:</Text>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="description"
            label={<Text>Description&nbsp;:</Text>}
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Description here." />
          </Form.Item>

          {/* Specific Email Controls */}
          <Form.Item label={<Text>Specific Email&nbsp;:</Text>}>
            <Input.Group compact>
              <Form.Item name="specificEmail" noStyle>
                <SpecificEmailInput placeholder="Enter Email" />
              </Form.Item>
              <Button onClick={handleAddEmail}>Add</Button>
              <Button type="primary" onClick={handleImport}>
                Import
              </Button>
            </Input.Group>
          </Form.Item>

          {/* Email Stats & Search */}
          <ControlsRow>
            <Text>
              Total Email: <Text strong>{emailList.length}</Text>
            </Text>
            <SearchInput
              placeholder="Search by Email / Name"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </ControlsRow>

          <Table<UserEmail>
            dataSource={filteredEmails}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          >
            <Table.Column title="Email" dataIndex="email" key="email" />
            <Table.Column
              title="Full Name"
              dataIndex="fullName"
              key="fullName"
            />
            <Table.Column<UserEmail>
              key="action"
              render={(_, record) => (
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              )}
            />
          </Table>
        </Form>
      </FormContainer>
    </PageWrapper>
  );
}
