/* eslint-disable no-useless-catch */
import { makeAutoObservable, runInAction } from "mobx";
import { api } from "@/shares/api/base";
import { API_ROUTES } from "@/shares/constants/api";
import type { InquiryEntity } from "../type";

class InquiryStore {
  inquiries: InquiryEntity[] = [];
  isLoading = false;
  selectedInquiry: InquiryEntity | null = null;

  totalCount = 0;
  unreadCount = 0;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCounts() {
    try {
      const response = await api.get<{ total: number; unread: number }>(
        `${API_ROUTES.ADMIN.INQUIRIES}/count`,
      );

      runInAction(() => {
        // Присваиваем значения напрямую
        this.totalCount = response.data.total;
        this.unreadCount = response.data.unread;
      });
    } catch (error) {
      console.error("Не удалось загрузить счетчики:", error);
    }
  }

  async fetchInquiries() {
    this.isLoading = true;
    try {
      const response = await api.get<InquiryEntity[]>(
        API_ROUTES.ADMIN.INQUIRIES,
      );
      runInAction(() => {
        this.inquiries = response.data;
        this.updateLocalCounts();
      });
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async deleteInquiry(id: string) {
    this.isLoading = true;
    try {
      await api.delete(`${API_ROUTES.ADMIN.INQUIRIES}/${id}`);
      runInAction(() => {
        const target = this.inquiries.find(iq => iq.id === id);

        if (target) {
            this.totalCount -= 1;
            if (!target.isRead) {
                this.unreadCount -= 1;
            }
        }

        this.inquiries = this.inquiries.filter((iq) => iq.id !== id);
        if (this.selectedInquiry?.id === id) this.selectedInquiry = null;
      });
      return true;
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async updateReadStatus(id: string, isRead: boolean) {
    this.isLoading = true;
    try {
      const response = await api.patch<InquiryEntity>(
        `${API_ROUTES.ADMIN.INQUIRIES}/${id}`,
        { isRead },
      );
      runInAction(() => {
        const index = this.inquiries.findIndex((iq) => iq.id === id);
        if (index !== -1) {
          const wasRead = this.inquiries[index].isRead;
          if (wasRead !== isRead) {
            this.unreadCount += isRead ? -1 : 1;
          }

          this.inquiries[index] = response.data;
        }

        if (this.selectedInquiry?.id === id)
          this.selectedInquiry = response.data;
      });
      return true;
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  private updateLocalCounts() {
    this.totalCount = this.inquiries.length;
    this.unreadCount = this.inquiries.filter(iq => !iq.isRead).length;
  }

  setSelectedInquiry(inquiry: InquiryEntity | null) {
    this.selectedInquiry = inquiry;
  }

  clearSelectedInquiry() {
    this.selectedInquiry = null;
  }
}

export const inquiryStore = new InquiryStore();
