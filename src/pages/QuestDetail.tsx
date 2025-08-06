import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Select,
  Switch,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { AxiosError } from "axios";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { QuillFormField } from "../components/QuilFormField";
import TitleBarHeader from "../components/TitleBarHeader";
import api from "../lib/api/axiosInstance";
import {
  PlatformLabels,
  QuestPlatform,
  type QuestPlatformEnum,
} from "../types/questPlatform";
import { QuestRankLabels, Rank, type QuestRankEnum } from "../types/questRank";

const { Content } = Layout;
const { Text } = Typography;

const PageContainer = styled.div`
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #0000000f;
  border-radius: 0.5rem;
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

const QuestionIcon = styled(QuestionCircleOutlined)`
  margin: 0 4px;
`;

const PLATFORM_OPTIONS = Object.values(QuestPlatform).map((value) => ({
  label: PlatformLabels[value],
  value,
}));

const RANK_OPTIONS = Object.values(Rank).map((value) => ({
  label: QuestRankLabels[value],
  value,
}));

interface QuestDetailFormValues {
  status: boolean;
  title: string;
  expiryDate?: Dayjs;
  platform?: QuestPlatformEnum;
  point: number;
  accountRank: QuestRankEnum[];
  requiredUploadEvidence: boolean;
  requiredEnterLink: boolean;
  allowSubmitMultiple: boolean;
  description: string;
  specificEmail?: string;
}

interface UserEmail {
  userId: number;
  email: string;
  fullName: string;
}

const QuestDetail: React.FC = () => {
  const navigate = useNavigate();
  const questData = useLoaderData() as any;
  const [form] = Form.useForm<QuestDetailFormValues>();
  const { t } = useTranslation("quest_detail");

  const [emailList, setEmailList] = useState<UserEmail[]>(questData.usersData);
  const [filteredEmails, setFilteredEmails] = useState<UserEmail[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredEmails(
      emailList?.filter(
        ({ email, fullName }) =>
          email.toLowerCase().includes(term) ||
          fullName.toLowerCase().includes(term)
      )
    );
  }, [emailList, searchTerm]);

  const handleAddEmail = async () => {
    const email = form.getFieldValue("specificEmail")?.trim();
    if (!email) {
      form.setFields([
        { name: "specificEmail", errors: ["Please enter email"] },
      ]);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      form.setFields([
        { name: "specificEmail", errors: ["Invalid email format"] },
      ]);
      return;
    }

    try {
      const res = await api.get("/api/v1/wmt/user/email", {
        params: { email, type: 1, objectId: questData.id },
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Email does not exist");
      }

      const user = res.data.data;

      if (emailList.some((u) => u.userId === user.userId)) {
        form.setFields([
          { name: "specificEmail", errors: ["Email already added"] },
        ]);
        return;
      }

      setEmailList((prev) => [user, ...prev]);
      form.resetFields(["specificEmail"]);
    } catch (err) {
      form.setFields([
        { name: "specificEmail", errors: [(err as Error).message] },
      ]);
    }
  };

  const importEmails = () => {
    message.error(t("messages.importNotImplemented"));
  };

  const deleteEmail = (id: number) => {
    setEmailList((prev) => prev.filter((u) => u.userId !== id));
  };

  const onFinish = async (values: QuestDetailFormValues) => {
    const existingIds = new Set(
      questData.usersData.map((u: { userId: any }) => u.userId)
    );
    const newlyAddedUserIds = emailList
      .map((u) => u.userId)
      .filter((id) => !existingIds.has(id));

    console.log(newlyAddedUserIds);

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
      ...(newlyAddedUserIds.length ? { userIds: newlyAddedUserIds } : {}),
    };

    try {
      await api.put(`/api/v1/wmt/quest/${questData.id}`, payload);
      message.success("Quest updated successfully");
      navigate(-1);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      message.error(error.response?.data?.message || "Failed to update quest");
    }
  };

  return (
    <PageContainer>
      <TitleBarHeader
        title={t("pageTitle")}
        actions={
          <Button type="primary" onClick={() => form.submit()}>
            Update
          </Button>
        }
      />

      <Content>
        <ContentWrapper>
          <Form
            form={form}
            layout="horizontal"
            labelAlign="left"
            colon
            labelCol={{ flex: "0 0 300px" }}
            wrapperCol={{ flex: "1 1 0%" }}
            onFinish={onFinish}
            initialValues={{
              status: questData.status,
              title: questData.title,
              expiryDate: questData.expiryDate
                ? dayjs(questData.expiryDate)
                : undefined,
              platform: questData.platform,
              point: questData.point,
              accountRank: questData.accountRank,
              requiredUploadEvidence: questData.requiredUploadEvidence,
              requiredEnterLink: questData.requiredEnterLink,
              allowSubmitMultiple: questData.allowSubmitMultiple,
              description: questData.description,
            }}
          >
            <Form.Item
              name="status"
              label={t("form.labels.status")}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="title"
              label={t("form.labels.title")}
              rules={[
                {
                  required: true,
                  message: t("validation.enterTitle"),
                },
                {
                  max: 200,
                  message: t("validation.titleMax", {
                    count: 200,
                  }),
                },
              ]}
            >
              <Input placeholder={t("form.placeholders.enterTitle")} />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label={
                <>
                  {t("form.labels.expiryDate")}
                  <Tooltip title={t("form.tooltips.expiryDate")}>
                    <QuestionIcon />
                  </Tooltip>
                </>
              }
              rules={[
                {
                  validator: (_, value: Dayjs | undefined) => {
                    if (!value) {
                      // no date selected – pass
                      return Promise.resolve();
                    }
                    // only allow today or future dates
                    if (
                      value.isSame(dayjs(), "day") ||
                      value.isAfter(dayjs(), "day")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("You can only choose a future date")
                    );
                  },
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="MM/DD/YYYY" />
            </Form.Item>

            <Form.Item
              name="platform"
              label={
                <>
                  {t("form.labels.platform")}
                  <Tooltip title={t("form.tooltips.platform")}>
                    <QuestionIcon />
                  </Tooltip>
                </>
              }
              initialValue={0}
            >
              <Select options={PLATFORM_OPTIONS} />
            </Form.Item>

            <Form.Item
              name="point"
              label={
                <>
                  {t("form.labels.point")}
                  <Tooltip title={t("form.tooltips.point")}>
                    <QuestionIcon />
                  </Tooltip>
                </>
              }
              rules={[
                {
                  required: true,
                  message: t("validation.enterPoint"),
                },
                {
                  type: "number",
                  min: 1,
                  max: 100000,
                  message: t("validation.pointRange", {
                    min: 1,
                    max: 100000,
                  }),
                },
              ]}
              initialValue={1}
            >
              <InputNumber<number>
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                }
              />
            </Form.Item>

            <Form.Item
              name="accountRank"
              label={
                <>
                  {t("form.labels.accountRanks")}
                  <Tooltip title={t("form.tooltips.accountRanks")}>
                    <QuestionIcon />
                  </Tooltip>
                </>
              }
              rules={[
                {
                  required: true,
                  message: t("validation.selectRank"),
                },
              ]}
            >
              <Checkbox.Group options={RANK_OPTIONS} />
            </Form.Item>

            <Form.Item
              label={
                <>
                  {t("form.labels.uploadImage")}{" "}
                  <Tooltip title={t("form.tooltips.uploadImage")}>
                    <QuestionIcon />
                  </Tooltip>
                </>
              }
              name="requiredUploadEvidence"
              valuePropName="checked"
              dependencies={["requiredEnterLink"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, checked) {
                    if (checked || getFieldValue("requiredEnterLink")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("validation.imageOrLinkRequired"))
                    );
                  },
                }),
              ]}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={
                <>
                  {t("form.labels.enterLink")}{" "}
                  <Tooltip title={t("form.tooltips.enterLink")}>
                    <QuestionIcon />
                  </Tooltip>
                </>
              }
              name="requiredEnterLink"
              valuePropName="checked"
              dependencies={["requiredUploadEvidence"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, checked) {
                    if (checked || getFieldValue("requiredUploadEvidence")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("validation.imageOrLinkRequired"))
                    );
                  },
                }),
              ]}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="allowSubmitMultiple"
              valuePropName="checked"
              label={
                <>
                  {t("form.labels.allowMultiple")}
                  <Tooltip title={t("form.tooltips.allowMultiple")}>
                    <QuestionIcon />
                  </Tooltip>
                </>
              }
              initialValue
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                },
                {
                  validator: (_, value) => {
                    const text = value?.replace(/<[^>]+>/g, "") || "";
                    if (!text.trim()) {
                      return Promise.reject("Description is required");
                    }
                    if (text.length > 2000) {
                      return Promise.reject(
                        "Description must be less than 2000 characters"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <QuillFormField value={questData.description} />
            </Form.Item>

            <Form.Item
              label={t("form.labels.specificEmail")}
              labelCol={{ flex: "0 0 300px" }}
              wrapperCol={{ flex: "1 1 auto" }}
            >
              <EmailControls>
                <Form.Item name="specificEmail" noStyle>
                  <Input placeholder={t("form.placeholders.enterEmail")} />
                </Form.Item>
                <Button onClick={handleAddEmail}>{t("buttons.add")}</Button>
                <Button type="primary" onClick={importEmails}>
                  {t("buttons.import")}
                </Button>
              </EmailControls>

              <TableWrapper>
                <StatsContainer>
                  <Text>
                    {t("table.totalEmails", {
                      count: emailList?.length,
                    })}
                  </Text>
                  <Input.Group style={{ width: "max-content" }} compact>
                    <Input
                      style={{ width: 247 }}
                      placeholder={t("table.searchPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button icon={<SearchOutlined />} />
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
                    title={t("table.columns.email")}
                    dataIndex="email"
                    key="email"
                  />
                  <Table.Column<UserEmail>
                    title={t("table.columns.fullName")}
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
                        onClick={() => deleteEmail(record.userId)}
                      >
                        {t("table.delete")}
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

export default QuestDetail;
