import type { FormInstance } from "antd";
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Tooltip,
} from "antd";
import type { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { QUEST_FORM_DATE_FORMAT } from "../../../constants/form";
import { getPlatformOptions, getRankOptions } from "../../../constants/labels";
import { useEmailList } from "../../../hooks/useEmailList";
import { useResponsiveFormLayout } from "../../../hooks/useResponsiveFormLayout";
import { namespaces } from "../../../i18n/namespaces";
import {
  QuestPlatform,
  type QuestPlatformEnum,
} from "../../../types/questPlatform";
import type { QuestRankEnum } from "../../../types/questRank";
import {
  descriptionRules,
  futureDateRule,
  pointRules,
} from "../../../utils/formRules";
import TextEditor from "../../common/TextEditor";
import EmailControls from "../shared/EmailControls";
import EmailTable from "../shared/EmailTable";
import { QuestionIcon } from "../shared/QuestionIcon.styles";

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
  form: FormInstance<AddNewQuestFormValues>;
  onSubmit: (
    values: AddNewQuestFormValues,
    userIds: number[]
  ) => void | Promise<void>;
}

const AddNewQuestForm: React.FC<Props> = ({ form, onSubmit }) => {
  const { t } = useTranslation(namespaces.addNewQuest);
  const layoutProps = useResponsiveFormLayout();
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

  return (
    <Form<AddNewQuestFormValues>
      form={form}
      labelAlign="left"
      {...layoutProps}
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
            <span>{t("form.labels.expiryDate")}</span>
            <Tooltip title={t("form.tooltips.expiryDate")}>
              <QuestionIcon />
            </Tooltip>
          </>
        }
        rules={[futureDateRule(t("validation.futureDateOnly"))]}
      >
        <DatePicker
          placeholder={t("form.placeholders.selectDate")}
          format={QUEST_FORM_DATE_FORMAT}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="platform"
        label={
          <>
            <span>{t("form.labels.platform")}</span>
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
            <span>{t("form.labels.point")}</span>
            <Tooltip title={t("form.tooltips.point")}>
              <QuestionIcon />
            </Tooltip>
          </>
        }
        validateTrigger={["onChange", "onBlur"]}
        rules={pointRules(t)}
      >
        <InputNumber<number>
          style={{ width: "100%" }}
          min={1}
          step={1}
          formatter={(v: number | string | undefined) =>
            `${v ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(v: string | undefined) =>
            Number((v ?? "").replace(/[\s,]/g, ""))
          }
        />
      </Form.Item>

      <Form.Item
        name="accountRank"
        label={
          <>
            <span>{t("form.labels.accountRanks")}</span>
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
        name="requiredUploadEvidence"
        valuePropName="checked"
        label={
          <>
            <span>{t("form.labels.uploadImage")}</span>
            <Tooltip title={t("form.tooltips.uploadImage")}>
              <QuestionIcon />
            </Tooltip>
          </>
        }
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
        name="requiredEnterLink"
        valuePropName="checked"
        label={
          <>
            <span>{t("form.labels.enterLink")}</span>
            <Tooltip title={t("form.tooltips.enterLink")}>
              <QuestionIcon />
            </Tooltip>
          </>
        }
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
            <span>{t("form.labels.allowMultiple")}</span>
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
        rules={descriptionRules(t)}
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
