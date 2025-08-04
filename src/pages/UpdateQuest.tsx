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
  Spin,
  Switch,
  Table,
  Typography,
} from "antd";
import type { AxiosError } from "axios";
import dayjs, { type Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api/axiosInstance";

const { Content } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

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

const UpdateQuest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<AddNewQuestFormValues>();
  const [emailList, setEmailList] = useState<UserEmail[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<UserEmail[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/v1/wmt/quest/${id}`)
      .then(({ data }) => {
        const q = data.data;
        form.setFieldsValue({
          status: q.status,
          title: q.title,
          expiryDate: q.expiryDate ? dayjs(q.expiryDate) : undefined,
          platform: q.platform,
          point: q.point,
          accountRank: q.accountRank,
          requiredUploadEvidence: q.requiredUploadEvidence,
          requiredEnterLink: q.requiredEnterLink,
          allowSubmitMultiple: q.allowSubmitMultiple,
          description: q.description,
        });
        setEmailList(q.userEmails); // or q.userIds mapped to {id,email,fullName}
        setLoading(false);
      })
      .catch(() => {
        message.error("Failed to load quest data");
        navigate(-1);
      });
  }, [id, form, navigate]);

  // 2️⃣ Filter emails when searching
  useEffect(() => {
    setFilteredEmails(
      emailList?.filter(
        (u) =>
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [emailList, searchTerm]);

  const handleAddEmail = () => {
    const email = form.getFieldValue("specificEmail")?.trim();
    if (!email) return message.error("Please enter an email");
    setEmailList((prev) => [...prev, { id: Date.now(), email, fullName: "" }]);
    form.setFieldValue("specificEmail", "");
  };

  const handleImport = () => message.info("Import clicked");

  const handleDelete = (uid: number) =>
    setEmailList((prev) => prev.filter((u) => u.id !== uid));

  const onFinish = async (vals: AddNewQuestFormValues) => {
    const payload = {
      title: vals.title,
      description: vals.description,
      status: vals.status,
      point: Number(vals.point),
      platform: vals.platform ?? 0,
      accountRank: vals.accountRank,
      requiredUploadEvidence: vals.requiredUploadEvidence,
      requiredEnterLink: vals.requiredEnterLink,
      allowSubmitMultiple: vals.allowSubmitMultiple,
      expiryDate: vals.expiryDate?.toISOString(),
      userIds: emailList.map((u) => u.id),
    };

    try {
      await api.put(`/api/v1/wmt/quest/${id}`, payload);
      message.success("Quest updated successfully");
      navigate(-1);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      message.error(error.response?.data?.message ?? "Failed to update quest");
    }
  };

  if (loading) {
    return (
      <Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading quest..." />
      </Content>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined className="text-gray-600" />
          <span className="text-lg font-medium text-gray-800">Edit Quest</span>
        </div>

        <Button
          type="primary"
          onClick={() => form.submit()}
          className="flex items-center"
        >
          Update
        </Button>
      </div>

      <Content>
        <div style={{ width: "100%", maxWidth: 1000 }}>
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

            <Form.Item
              name="expiryDate"
              label={<Text>Expiry Date&nbsp;:</Text>}
            >
              <DatePicker style={{ width: "100%" }} placeholder="Select date" />
            </Form.Item>

            <Form.Item name="platform" label={<Text>Platform&nbsp;:</Text>}>
              <Select placeholder="Select">
                <Select.Option value={0}>Other</Select.Option>
                <Select.Option value={1}>Facebook</Select.Option>
                <Select.Option value={2}>Instagram</Select.Option>
                <Select.Option value={3}>YouTube</Select.Option>
                <Select.Option value={4}>Telegram</Select.Option>
                <Select.Option value={5}>TikTok</Select.Option>
                <Select.Option value={6}>Twitter</Select.Option>
                <Select.Option value={7}>Discord</Select.Option>
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
              rules={[
                { required: true, message: "Please select at least one rank" },
              ]}
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

            <Form.Item label={<Text>Specific Email&nbsp;:</Text>}>
              <Input.Group compact>
                <Form.Item name="specificEmail" noStyle>
                  <Input style={{ width: "70%" }} placeholder="Enter Email" />
                </Form.Item>
                <Button onClick={handleAddEmail}>Add</Button>
                <Button type="primary" onClick={handleImport}>
                  Import
                </Button>
              </Input.Group>
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text>
                Total Email: <Text strong>{emailList?.length}</Text>
              </Text>
              <Input
                placeholder="Search by Email / Full Name"
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Table<UserEmail>
              dataSource={filteredEmails}
              rowKey="id"
              pagination={{ current: page, pageSize: 10, onChange: setPage }}
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
                render={(_txt, record) => (
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
        </div>
      </Content>
    </div>
  );
};

export default UpdateQuest;
