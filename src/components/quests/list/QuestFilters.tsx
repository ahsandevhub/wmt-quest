import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  QuestStatus,
  QuestStatusLabels,
  type QuestStatusEnum,
} from "../../../types/questStatus";

const { Search } = Input;

/* ================= Styled ================= */
const ToolbarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
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
`;

const FieldWrap = styled.div`
  /* label + control inline at all sizes */
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

  /* Make AntD internals flexible so nothing overflows */
  .ant-input-group-wrapper,
  .ant-input-group,
  .ant-input-affix-wrapper,
  .ant-select,
  .ant-select-selector {
    width: 100%;
    min-width: 0;
  }
  .ant-input {
    min-width: 0;
  }

  @media (max-width: 768px) {
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
`;

/* ================= Component ================= */
const QuestFilters: React.FC = () => {
  const { t } = useTranslation("quest_list");
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<{
    keywords?: string;
    status?: QuestStatusEnum;
  }>();

  const initialKeywords = searchParams.get("keywords") ?? "";
  const initialStatus =
    (searchParams.get("status") as QuestStatusEnum) ?? QuestStatus.All;

  const statusOptions = useMemo(
    () =>
      Object.values(QuestStatus).map((value) => ({
        value: value as QuestStatusEnum,
        label: QuestStatusLabels[value as QuestStatusEnum],
      })),
    []
  );

  const submitFilters = (values: {
    keywords?: string;
    status?: QuestStatusEnum;
  }) => {
    const params: Record<string, string> = {};
    const trimmed = (values.keywords ?? "").trim();

    if (trimmed) params.keywords = trimmed;
    if (values.status) params.status = values.status;

    setSearchParams(params, { replace: true });
  };

  const resetFilters = () => {
    form.setFieldsValue({
      keywords: undefined,
      status: undefined,
    });

    setSearchParams({}, { replace: true });
  };

  return (
    <Form
      form={form}
      layout="inline"
      initialValues={{ keywords: initialKeywords, status: initialStatus }}
      onFinish={submitFilters}
      style={{ width: "100%" }}
    >
      <ToolbarContainer>
        <FieldWrap>
          <span>{t("toolbar.search_box.label")}</span>
          <ControlWrap>
            <Form.Item name="keywords" noStyle>
              <Search
                placeholder={t("toolbar.search_box.placeholderSearch")}
                allowClear
                maxLength={50}
                onSearch={() => form.submit()}
              />
            </Form.Item>
          </ControlWrap>
        </FieldWrap>

        <FieldWrap>
          <span>{t("toolbar.status_filter.label")}</span>
          <ControlWrap>
            <Form.Item name="status" noStyle>
              <Select<QuestStatusEnum>
                allowClear
                options={statusOptions}
                placeholder={t("toolbar.status_filter.placeholder")}
              />
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
                {t("toolbar.search_button")}
              </Button>
              <Button icon={<SyncOutlined />} onClick={resetFilters}>
                {t("toolbar.reset_button")}
              </Button>
            </ButtonRow>
          )}
        </Form.Item>
      </ToolbarContainer>
    </Form>
  );
};

export default React.memo(QuestFilters);
