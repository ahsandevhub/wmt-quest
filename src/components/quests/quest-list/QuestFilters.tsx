import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { namespaces } from "../../../i18n/namespaces";
import {
  buildParamsFromValues,
  buildStatusOptions,
  getInitialValuesFromSearchParams,
  type QuestFilterValues,
} from "../../../services/quests/questFilters.service";
import {
  ButtonRow,
  ControlWrap,
  FieldWrap,
  FiltersFormWrapper,
  ToolbarContainer,
} from "./QuestFilters.Styled";

const { Search } = Input;

const QuestFilters: React.FC = () => {
  const { t } = useTranslation(namespaces.questList);
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<QuestFilterValues>();

  const initialValues = useMemo(
    () => getInitialValuesFromSearchParams(searchParams),
    [searchParams]
  );

  const statusOptions = useMemo(() => buildStatusOptions(), []);

  const submitFilters = (values: QuestFilterValues) => {
    const params = buildParamsFromValues(values);
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
    <FiltersFormWrapper>
      <Form<QuestFilterValues>
        form={form}
        layout="inline"
        initialValues={initialValues}
        onFinish={submitFilters}
      >
        <ToolbarContainer>
          <FieldWrap>
            <span>{t("toolbar.searchBox.label")}</span>
            <ControlWrap>
              <Form.Item name="keywords" noStyle>
                <Search
                  placeholder={t("toolbar.searchBox.placeholder")}
                  allowClear
                  maxLength={50}
                  onSearch={() => form.submit()}
                />
              </Form.Item>
            </ControlWrap>
          </FieldWrap>

          <FieldWrap>
            <span>{t("toolbar.statusFilter.label")}</span>
            <ControlWrap>
              <Form.Item name="status" noStyle>
                <Select<QuestFilterValues["status"]>
                  allowClear
                  options={statusOptions}
                  placeholder={t("toolbar.statusFilter.placeholder")}
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
                  {t("toolbar.searchButton")}
                </Button>
                <Button icon={<SyncOutlined />} onClick={resetFilters}>
                  {t("toolbar.resetButton")}
                </Button>
              </ButtonRow>
            )}
          </Form.Item>
        </ToolbarContainer>
      </Form>
    </FiltersFormWrapper>
  );
};

export default React.memo(QuestFilters);
