import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
// styles are imported from companion .styles file
import { namespaces } from "../../../i18n/namespaces";
import {
  ButtonRow,
  ControlWrap,
  FieldWrap,
  ToolbarContainer,
} from "./QuestRequestFilters.styles";

import {
  getQuestRequestStatusOptions,
  getQuestTypeOptions,
} from "../../../constants/labels";
import type { QuestRequestStatusEnum } from "../../../types/questRequestStatus";
import type { QuestTypeEnum } from "../../../types/questType";

const { Search } = Input;
const { RangePicker } = DatePicker;

/* imported styles */

/* ================= Types ================= */
type FormValues = {
  keywords?: string;
  status?: QuestRequestStatusEnum;
  questType?: QuestTypeEnum;
  submittedRange?: [Dayjs, Dayjs];
};

/* ================ Component =============== */
const QuestRequestFilters: React.FC = () => {
  const { t } = useTranslation(namespaces.questRequestList);
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<FormValues>();

  // Parse initial values from URL
  const initialKeywords = searchParams.get("keywords") ?? "";
  const initialStatus = searchParams.get("status")
    ? (Number(searchParams.get("status")) as QuestRequestStatusEnum)
    : undefined;
  const initialQuestType = searchParams.get("questType")
    ? (Number(searchParams.get("questType")) as QuestTypeEnum)
    : undefined;
  const initialRange = (() => {
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    if (!start || !end) return undefined;
    const startD = dayjs(start);
    const endD = dayjs(end);
    return startD.isValid() && endD.isValid()
      ? ([startD, endD] as [Dayjs, Dayjs])
      : undefined;
  })();

  // Options (localized)
  const statusOptions = useMemo(() => getQuestRequestStatusOptions(t), [t]);
  const questTypeOptions = useMemo(() => getQuestTypeOptions(t), [t]);

  const submitFilters = (values: FormValues) => {
    const params: Record<string, string> = {};
    const trimmed = (values.keywords ?? "").trim();

    if (trimmed) params.keywords = trimmed;
    if (values.status !== undefined) params.status = String(values.status);
    if (values.questType !== undefined)
      params.questType = String(values.questType);

    if (values.submittedRange?.length === 2) {
      const [from, to] = values.submittedRange;
      if (from?.isValid()) params.startDate = from.toISOString();
      if (to?.isValid()) params.endDate = to.toISOString();
    }

    setSearchParams(params, { replace: true });
  };

  const resetFilters = () => {
    form.setFieldsValue({
      keywords: undefined,
      status: undefined,
      questType: undefined,
      submittedRange: undefined,
    });
    setSearchParams({}, { replace: true });
  };

  return (
    <Form<FormValues>
      form={form}
      layout="inline"
      initialValues={{
        keywords: initialKeywords,
        status: initialStatus,
        questType: initialQuestType,
        submittedRange: initialRange,
      }}
      onFinish={submitFilters}
      style={{ width: "100%" }}
    >
      <ToolbarContainer>
        {/* Keywords */}
        <FieldWrap>
          <span>{t("toolbar.searchBox.label", "Keywords:")}</span>
          <ControlWrap>
            <Form.Item name="keywords" noStyle>
              <Search
                placeholder={t(
                  "toolbar.searchBox.placeholder",
                  "Search by Request ID / Quest ID / Email / Quest Title"
                )}
                allowClear
                maxLength={50}
                onSearch={() => form.submit()}
              />
            </Form.Item>
          </ControlWrap>
        </FieldWrap>

        {/* Status */}
        <FieldWrap>
          <span>{t("toolbar.statusFilter.label", "Status:")}</span>
          <ControlWrap>
            <Form.Item name="status" noStyle>
              <Select<QuestRequestStatusEnum>
                allowClear
                options={statusOptions}
                placeholder={t("toolbar.statusFilter.all", "All Statuses")}
              />
            </Form.Item>
          </ControlWrap>
        </FieldWrap>

        {/* Quest Type */}
        <FieldWrap>
          <span>{t("toolbar.questTypeFilter.label", "Quest Type:")}</span>
          <ControlWrap>
            <Form.Item name="questType" noStyle>
              <Select<QuestTypeEnum>
                allowClear
                options={questTypeOptions}
                placeholder={t("toolbar.questTypeFilter.all", "All Quests")}
              />
            </Form.Item>
          </ControlWrap>
        </FieldWrap>

        {/* Submitted Date Range */}
        <FieldWrap>
          <span>{t("toolbar.submittedDate.label", "Submitted Date:")}</span>
          <ControlWrap>
            <Form.Item name="submittedRange" noStyle>
              <RangePicker allowClear />
            </Form.Item>
          </ControlWrap>
        </FieldWrap>

        <Form.Item shouldUpdate>
          {() => (
            <ButtonRow>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                {t("toolbar.searchButton", "Search")}
              </Button>
              <Button icon={<SyncOutlined />} onClick={resetFilters}>
                {t("toolbar.resetButton", "Reset")}
              </Button>
            </ButtonRow>
          )}
        </Form.Item>
      </ToolbarContainer>
    </Form>
  );
};

export default QuestRequestFilters;
