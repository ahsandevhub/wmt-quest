import {
  ArrowLeftOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Layout,
  Select,
  Switch,
  Table,
  Typography,
  message,
} from "antd";
import type { AxiosError } from "axios";
import type { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../lib/api/axiosInstance";

const { Content } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const PageContainer = styled.div`
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #0000000f;
  border-radius: 0.5rem;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #4b5563;

  &:hover {
    opacity: 0.8;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
`;

const EmailControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .ant-input {
    flex: 1;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  justify-content: space-between;
  align-items: center;
`;

const TableWrapper = styled.div`
  border: 1px solid #0000000f;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  padding: 1rem;
  margin-top: 1rem;

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 6px 10px;
  }
`;

const PLATFORM_OPTIONS = [
  { label: "Other", value: 0 },
  { label: "Facebook", value: 1 },
  { label: "Instagram", value: 2 },
  { label: "YouTube", value: 3 },
  { label: "Telegram", value: 4 },
  { label: "TikTok", value: 5 },
  { label: "Twitter", value: 6 },
  { label: "Discord", value: 7 },
];

const RANK_OPTIONS = [
  { label: "Silver", value: 1 },
  { label: "Gold", value: 2 },
  { label: "Diamond", value: 3 },
];

interface AddNewQuestFormValues {
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

interface UserEmail {
  id: number;
  email: string;
  fullName: string;
}

const AddNewQuest: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<AddNewQuestFormValues>();

  const [emailList, setEmailList] = useState<UserEmail[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<UserEmail[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // filter emails when list or searchTerm changes
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredEmails(
      emailList.filter(
        ({ email, fullName }) =>
          email.toLowerCase().includes(term) ||
          fullName.toLowerCase().includes(term)
      )
    );
  }, [emailList, searchTerm]);

  const addEmail = () => {
    const email = form.getFieldValue("specificEmail")?.trim();
    if (!email) {
      return message.error("Please enter an email");
    }
    setEmailList((prev) => [...prev, { id: Date.now(), email, fullName: "" }]);
    form.setFieldValue("specificEmail", "");
  };

  const importEmails = () => {
    message.info("Import clicked");
  };

  const deleteEmail = (id: number) => {
    setEmailList((prev) => prev.filter((u) => u.id !== id));
  };

  const onFinish = async (values: AddNewQuestFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      status: values.status,
      point: Number(values.point),
      platform: values.platform ?? 0,
      accountRank: values.accountRank,
      requiredUploadEvidence: values.requiredUploadEvidence,
      requiredEnterLink: values.requiredEnterLink,
      allowSubmitMultiple: values.allowSubmitMultiple,
      expiryDate: values.expiryDate?.toISOString(),
      userIds: emailList.map((u) => u.id),
    };

    try {
      await api.post(
        `${import.meta.env.VITE_API_BASE}/api/v1/wmt/quest`,
        payload
      );
      message.success("Quest added successfully");
      navigate(-1);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const apiMsg =
        err.response?.data?.message || "Failed to add quest. Please try again.";
      message.error(apiMsg);
    }
  };

  return (
    <PageContainer>
      <HeaderBar>
        <BackLink onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
          <Text strong>Add New Quest</Text>
        </BackLink>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => form.submit()}
        >
          Add
        </Button>
      </HeaderBar>

      <Content>
        <ContentWrapper>
          <Form
            form={form}
            layout="horizontal"
            labelAlign="left"
            colon={false}
            labelCol={{ flex: "0 0 300px" }}
            wrapperCol={{ flex: "1 1 auto" }}
            onFinish={onFinish}
            initialValues={{
              status: false,
              requiredUploadEvidence: false,
              requiredEnterLink: false,
              allowSubmitMultiple: false,
              accountRank: [],
            }}
          >
            <Form.Item name="status" label="Active :" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title :"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="Enter Title" />
            </Form.Item>

            <Form.Item name="expiryDate" label="Expiry Date :">
              <DatePicker style={{ width: "100%" }} placeholder="Select date" />
            </Form.Item>

            <Form.Item name="platform" label="Platform :">
              <Select placeholder="Select" options={PLATFORM_OPTIONS} />
            </Form.Item>

            <Form.Item
              name="point"
              label="Point :"
              rules={[{ required: true, message: "Please enter point" }]}
            >
              <Input type="number" placeholder="Enter Point" />
            </Form.Item>

            <Form.Item
              name="accountRank"
              label="Account Ranks :"
              rules={[
                {
                  required: true,
                  message: "Please select at least one rank",
                },
              ]}
            >
              <Checkbox.Group options={RANK_OPTIONS} />
            </Form.Item>

            <Form.Item
              name="requiredUploadEvidence"
              label="Required Upload Image :"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="requiredEnterLink"
              label="Required Enter Link :"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="allowSubmitMultiple"
              label="Allow Multiple Submission :"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description :"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea rows={2} placeholder="Description here." />
            </Form.Item>

            <Form.Item
              label="Specific Email :"
              labelCol={{ flex: "0 0 300px" }}
              wrapperCol={{ flex: "1 1 auto" }}
            >
              <EmailControls>
                <Form.Item name="specificEmail" noStyle>
                  <Input placeholder="Enter Email" />
                </Form.Item>
                <Button onClick={addEmail}>Add</Button>
                <Button type="primary" onClick={importEmails}>
                  Import
                </Button>
              </EmailControls>
              <TableWrapper>
                <StatsContainer>
                  <Text>
                    Total Email: <Text strong>{emailList.length}</Text>
                  </Text>
                  <Input.Group style={{ width: "max-content" }} compact>
                    <Input
                      style={{ width: 247 }}
                      placeholder="Search by Email / Full Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button>
                      <SearchOutlined />
                    </Button>
                  </Input.Group>
                </StatsContainer>

                <Table<UserEmail>
                  dataSource={filteredEmails}
                  rowKey="id"
                  pagination={{
                    current: page,
                    pageSize: 10,
                    onChange: setPage,
                  }}
                >
                  <Table.Column<UserEmail>
                    title="Email"
                    dataIndex="email"
                    key="email"
                  />
                  <Table.Column<UserEmail>
                    title="Full Name"
                    dataIndex="fullName"
                    key="fullName"
                  />
                  <Table.Column<UserEmail>
                    key="action"
                    width={100}
                    align="right"
                    render={(_, record) => (
                      <Button
                        type="link"
                        danger
                        onClick={() => deleteEmail(record.id)}
                      >
                        Delete
                      </Button>
                    )}
                  />
                </Table>
              </TableWrapper>
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Content>
    </PageContainer>
  );
};

export default AddNewQuest;
