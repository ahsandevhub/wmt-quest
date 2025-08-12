import { message } from "antd";
import type { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import api from "../services/http";

export interface UserEmail {
  userId: number;
  email: string;
  fullName: string;
}

type FetchUserByEmailResponse = {
  success: boolean;
  data: { userId: number; email: string; fullName: string };
  message?: string;
};

export function useEmailList(
  t: (key: string, vars?: any) => string,
  initial: UserEmail[] = [],
  objectId?: number
) {
  const [emailList, setEmailList] = useState<UserEmail[]>(initial);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filteredEmails = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return emailList;
    return emailList.filter(
      ({ email, fullName }) =>
        email.toLowerCase().includes(term) ||
        fullName.toLowerCase().includes(term)
    );
  }, [emailList, searchTerm]);

  useEffect(() => setPage(1), [searchTerm]);

  const addEmailByLookup = async (email: string) => {
    try {
      const res = await api.get<FetchUserByEmailResponse>(
        "/api/v1/wmt/user/email",
        { params: { email, type: 1, objectId } }
      );
      const user = res.data.data;
      const exists = emailList.some((u) => u.userId === user.userId);
      if (exists) {
        message.error(t("validation.emailDuplicate"));
        return false;
      }
      setEmailList((prev) => [user, ...prev]);
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string; code: string }>;
      const apiMsg =
        err.response?.data?.code === "CFN_ERR_035"
          ? t("validation.emailNotExist")
          : t("validation.requestFailed");
      message.error(apiMsg);
      return false;
    }
  };

  const removeEmail = (userId: number) =>
    setEmailList((prev) => prev.filter((u) => u.userId !== userId));

  const importEmails = () => {
    message.error(t("messages.importNotImplemented"));
  };

  return {
    emailList,
    filteredEmails,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    addEmailByLookup,
    removeEmail,
    importEmails,
  };
}
