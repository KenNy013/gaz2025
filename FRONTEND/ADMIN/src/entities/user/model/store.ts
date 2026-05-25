import { makeAutoObservable, runInAction } from "mobx";
import { api } from "@/shares/api/base";
import { API_ROUTES } from "@/shares/constants/api";
import type { User } from "@/entities/user/types";

class UserStore {
  isAuthenticated = false;
  isInit = false;
  user: User | null = null;
  isServerError = false;
  serverErrorDetails: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async checkServerHealth(): Promise<boolean> {
    try {
      await api.get(API_ROUTES.ADMIN.ME, { timeout: 5000 });
      runInAction(() => {
        this.isServerError = false;
        this.serverErrorDetails = null;
      });
      return true;
    } catch (error: any) {
      const isNetworkError = this.isNetworkError(error);
      if (isNetworkError) {
        runInAction(() => {
          this.isServerError = true;
          this.serverErrorDetails = error.message || 'Сервер недоступен';
        });
      }
      return false;
    }
  }

  async checkAuth() {
    runInAction(() => {
      this.isServerError = false;
      this.serverErrorDetails = null;
    });

    try {
      const response = await api.get<User>(API_ROUTES.ADMIN.ME);

      runInAction(() => {
        this.isAuthenticated = true;
        this.user = response.data;
      });
    } catch (error: any) {
      const isNetworkError = this.isNetworkError(error);

      runInAction(() => {
        if (isNetworkError) {
          this.isServerError = true;
          this.serverErrorDetails = error.message || 'Сервер недоступен';
          this.isAuthenticated = false;
          this.user = null;
        } else {
          this.isServerError = false;
          this.isAuthenticated = false;
          this.user = null;
        }
      });
    } finally {
      runInAction(() => {
        this.isInit = true;
      });
    }
  }

  private isNetworkError(error: any): boolean {
    return (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      error.message?.includes('timeout') ||
      error.message?.includes('Network Error')
    );
  }

  setAuth(value: boolean, userData?: User) {
    this.isAuthenticated = value;
    this.user = userData || null;
  }

  async logout() {
    try {
      await api.post(API_ROUTES.ADMIN.LOGOUT);
    } catch (e) {
      console.error(e);
    } finally {
      runInAction(() => {
        this.isAuthenticated = false;
        this.user = null;
      });
    }
  }
}

export const userStore = new UserStore();
