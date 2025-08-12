import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  QuestRequestStatus,
  QuestRequestStatusLabels,
  type QuestRequestStatusEnum,
} from "../../../types/questRequestStatus";
import {
  QuestType,
  QuestTypeLabels,
  type QuestTypeEnum,
} from "../../../types/questType";

const { Search } = Input;
const { RangePicker } = DatePicker;

/* ================= Styled ================= */
const ToolbarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap; /* default */
  align-items: center;
  gap: 16px;
  background: #fff;
  padding: 16px 24px;
  border: 1px solid #0000000f;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
    > * {
      width: 100%;
    }
  }

  @media (min-width: 1440px) {
    flex-wrap: nowrap;
    > * {
      min-width: 0;
      flex: 1 1 0;
    }
  }
`;

const FieldWrap = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  column-gap: 12px;
  min-width: 0;
  white-space: nowrap;
  width: auto;

  span {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ControlWrap = styled.div`
  width: clamp(260px, 34vw, 420px);
  min-width: 0;
  justify-self: start;

  .ant-input-group-wrapper,
  .ant-input-group,
  .ant-input-affix-wrapper,
  .ant-select,
  .ant-select-selector,
  .ant-picker {
    width: 100%;
    min-width: 0;
  }
  .ant-input {
    min-width: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 1024px) {
    width: 100%;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    > * {
      flex: 1;
    }
  }

  @media (min-width: 1024px) {
    flex: 0 0 auto;
    margin-left: auto;
  }
`;

/* ================= Types ================= */
type FormValues = {
  keywords?: string;
  status?: QuestRequestStatusEnum;
  questType?: QuestTypeEnum;
  submittedRange?: [Dayjs, Dayjs];
};

/* ================= Component ================= */
const QuestRequestFilters: React.FC = () => {
  const { t } = useTranslation("quest_request_list");
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<FormValues>();

  // Initial values from URL
  const initialKeywords = searchParams.get("keywords") ?? "";
  const initialStatus = ((): QuestRequestStatusEnum | undefined => {
    const raw = searchParams.get("status");
    return raw !== null ? (Number(raw) as QuestRequestStatusEnum) : undefined;
  })();
  const initialQuestType = ((): QuestTypeEnum | undefined => {
    const raw = searchParams.get("questType");
    return raw !== null ? (Number(raw) as QuestTypeEnum) : undefined;
  })();
  const initialRange = ((): [Dayjs, Dayjs] | undefined => {
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    if (!start || !end) return undefined;
    const startD = dayjs(start);
    const endD = dayjs(end);
    return startD.isValid() && endD.isValid()
      ? ([startD, endD] as [Dayjs, Dayjs])
      : undefined;
  })();

  // Options
  const statusOptions = useMemo(
    () =>
      Object.values(QuestRequestStatus).map((value) => ({
        value: value as QuestRequestStatusEnum,
        label: QuestRequestStatusLabels[value as QuestRequestStatusEnum],
      })),
    []
  );

  const questTypeOptions = useMemo(
    () =>
      Object.values(QuestType).map((value) => ({
        value: value as QuestTypeEnum,
        label: QuestTypeLabels[value as QuestTypeEnum],
      })),
    []
  );

  const submitFilters = (values: FormValues) => {
    const params: Record<string, string> = {};
    const trimmed = (values.keywords ?? "").trim();

    if (trimmed) params.keywords = trimmed;
    if (values.status !== undefined) params.status = String(values.status);
    if (values.questType !== undefined)
      params.questType = String(values.questType);

    if (values.submittedRange && values.submittedRange.length === 2) {
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
    <Form
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
          <span>{t("toolbar.search_box.label", "Keywords:")}</span>
          <ControlWrap>
            <Form.Item name="keywords" noStyle>
              <Search
                placeholder={t(
                  "toolbar.search_box.placeholderSearch",
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
          <span>{t("toolbar.status_filter.label", "Status:")}</span>
          <ControlWrap>
            <Form.Item name="status" noStyle>
              <Select<QuestRequestStatusEnum>
                allowClear
                options={statusOptions}
                placeholder={t(
                  "toolbar.status_filter.placeholder",
                  "All Statuses"
                )}
              />
            </Form.Item>
          </ControlWrap>
        </FieldWrap>

        {/* Quest Type */}
        <FieldWrap>
          <span>{t("toolbar.quest_type_filter.label", "Quest Type:")}</span>
          <ControlWrap>
            <Form.Item name="questType" noStyle>
              <Select<QuestTypeEnum>
                allowClear
                options={questTypeOptions}
                placeholder={t(
                  "toolbar.quest_type_filter.placeholder",
                  "All Quests"
                )}
              />
            </Form.Item>
          </ControlWrap>
        </FieldWrap>

        {/* Submitted Date Range */}
        <FieldWrap>
          <span>{t("toolbar.submitted_range.label", "Submitted Date:")}</span>
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
                {t("toolbar.search_button", "Search")}
              </Button>
              <Button icon={<SyncOutlined />} onClick={resetFilters}>
                {t("toolbar.reset_button", "Reset")}
              </Button>
            </ButtonRow>
          )}
        </Form.Item>
      </ToolbarContainer>
    </Form>
  );
};

export default React.memo(QuestRequestFilters);
