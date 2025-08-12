import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Checkbox,
  DatePicker,
  Form,
  Grid,
  Input,
  InputNumber,
  Select,
  Switch,
  Tooltip,
} from "antd";
import type { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { getPlatformOptions, getRankOptions } from "../../../constants/labels";
import { useEmailList } from "../../../hooks/useEmailList";
import { namespaces } from "../../../i18n/namespaces";
import {
  QuestPlatform,
  type QuestPlatformEnum,
} from "../../../types/questPlatform";
import type { QuestRankEnum } from "../../../types/questRank";
import { isFutureOrToday, validatePoint } from "../../../utils/validators";
import TextEditor from "../../common/TextEditor";
import EmailControls from "./EmailControls";
import EmailTable from "./EmailTable";

const QuestionIcon = styled(QuestionCircleOutlined)`
  margin: 0 4px;
`;

export interface AddNewQuestFormValues {
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
}

interface Props {
  form: any;
  onSubmit: (
    values: AddNewQuestFormValues,
    userIds: number[]
  ) => void | Promise<void>;
}

const AddNewQuestForm: React.FC<Props> = ({ form, onSubmit }) => {
  const { t } = useTranslation(namespaces.addNewQuest);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md; // below ~768px
  const {
    emailList,
    filteredEmails,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    addEmailByLookup,
    removeEmail,
    importEmails,
  } = useEmailList(t);
  const PLATFORM_OPTIONS = useMemo(() => getPlatformOptions(t), [t]);
  const RANK_OPTIONS = useMemo(() => getRankOptions(t), [t]);
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: AddNewQuestFormValues) => {
    setSubmitting(true);
    try {
      await onSubmit(
        values,
        emailList.map((e) => e.userId)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formLayoutProps = isMobile
    ? {
        layout: "vertical" as const,
        colon: true,
      }
    : {
        layout: "horizontal" as const,
        colon: true,
        labelCol: { flex: "0 0 300px" },
        wrapperCol: { flex: "1 1 0%" },
      };

  return (
    <Form<AddNewQuestFormValues>
      form={form}
      labelAlign="left"
      {...formLayoutProps}
      onFinish={handleFinish}
      initialValues={{
        status: true,
        requiredUploadEvidence: true,
        requiredEnterLink: true,
        allowSubmitMultiple: true,
        accountRank: [],
        description: "",
        platform: QuestPlatform.Other,
        point: 1,
      }}
      disabled={submitting}
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
          { required: true, message: t("validation.enterTitle") },
          { max: 200, message: t("validation.titleMax", { count: 200 }) },
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
            validator: (_, value: Dayjs | undefined) =>
              isFutureOrToday(value)
                ? Promise.resolve()
                : Promise.reject(new Error(t("validation.futureDateOnly"))),
          },
        ]}
      >
        <DatePicker
          placeholder={t("form.placeholders.selectDate")}
          format="MM/DD/YYYY"
          style={{ width: "100%" }}
        />
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
        validateTrigger={["onChange", "onBlur"]}
        rules={[
          { required: true, message: t("validation.enterPoint") },
          {
            validator: (_, value) => {
              const code = validatePoint(value);
              return code
                ? Promise.reject(
                    new Error(
                      code === "pointRange"
                        ? t("validation.pointRange", { min: 1, max: 100000 })
                        : t(`validation.${code}`)
                    )
                  )
                : Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber<number>
          style={{ width: "100%" }}
          min={1}
          step={1}
          formatter={(v) => `${v ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(v) => Number((v ?? "").replace(/[\s,]/g, ""))}
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
        rules={[{ required: true, message: t("validation.selectRank") }]}
      >
        <Checkbox.Group options={RANK_OPTIONS} />
      </Form.Item>

      <Form.Item
        label={
          <>
            {t("form.labels.uploadImage")}
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
              return checked || getFieldValue("requiredEnterLink")
                ? Promise.resolve()
                : Promise.reject(
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
            {t("form.labels.enterLink")}
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
              return checked || getFieldValue("requiredUploadEvidence")
                ? Promise.resolve()
                : Promise.reject(
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
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="description"
        label={t("form.labels.description")}
        validateFirst
        rules={[
          { required: true, message: t("validation.enterDescription") },
          {
            validator: (_, value) => {
              const text = value?.replace(/<[^>]+>/g, "") || "";
              if (!text.trim())
                return Promise.reject(t("validation.enterDescription"));
              if (text.length > 2000)
                return Promise.reject(
                  t("validation.descriptionMax", { count: 2000 })
                );
              return Promise.resolve();
            },
          },
        ]}
      >
        <TextEditor />
      </Form.Item>

      <Form.Item label={t("form.labels.specificEmail")}>
        <EmailControls t={t} onAdd={addEmailByLookup} onImport={importEmails} />
        <EmailTable
          t={t}
          list={emailList}
          filtered={filteredEmails}
          page={page}
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRemove={removeEmail}
        />
      </Form.Item>
    </Form>
  );
};

export default AddNewQuestForm;
