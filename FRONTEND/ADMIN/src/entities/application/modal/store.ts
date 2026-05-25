import { makeAutoObservable, runInAction } from "mobx";
import { api } from "@/shares/api/base";
import { API_ROUTES } from "@/shares/constants/api";
import type {ApplicationEntity } from "../types";

export type SearchFieldType = 'name' | 'phone' | 'vin' | 'plate';

class ApplicationStore {
  applications: ApplicationEntity[] = [];
  isLoading = false;

  searchQuery = "";
  searchField: SearchFieldType = 'name';
  statusFilter: string | null = null;

  selectedApplication: ApplicationEntity | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private normalizePhotos(app: ApplicationEntity): ApplicationEntity {
  return {
    ...app,
    photos: typeof app.photos === 'string' ? JSON.parse(app.photos) : app.photos
  };
}

async fetchApplications() {
  this.isLoading = true;
  try {
    const response = await api.get<ApplicationEntity[]>(API_ROUTES.ADMIN.APPLICATIONS);
    runInAction(() => {
      this.applications = response.data.map(app => this.normalizePhotos(app));
    });
  } catch (error) {
    console.error(error);
  } finally {
    runInAction(() => this.isLoading = false);
  }
}

async createApplication(formData: FormData) {
  this.isLoading = true;
  try {
    const response = await api.post<{ message: string; data: ApplicationEntity }>(
      API_ROUTES.CLIENT.APPLICATIONS,
      formData
    );

    await new Promise((res)=> {
      setTimeout(()=> {
        res(true)
      }, 8000)
    })

    runInAction(() => {
      const newApp = this.normalizePhotos(response.data.data);
      this.applications.unshift(newApp);
    });
    return true;
  // eslint-disable-next-line no-useless-catch
  } catch (error) {
    throw error;
  } finally {
    runInAction(() => this.isLoading = false);
  }
}

async deleteApplication(id: string) {
  this.isLoading = true;
  try {
    await api.delete((API_ROUTES.ADMIN.DELETE(id)));
    runInAction(() => {
      this.applications = this.applications.filter(app => app.id !== id);
    });

    return true;
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    throw error;
  } finally {
    runInAction(() => this.isLoading = false);
  }
}

async updateStatus(id: string, status: string, message: string) {
  this.isLoading = true;
  try {
    const response = await api.patch<ApplicationEntity>(
      API_ROUTES.ADMIN.PATCH(id),
      { status, message }
    );

    runInAction(() => {

      const index = this.applications.findIndex(app => app.id === id);
      if (index !== -1) {
        this.applications[index] = {
          ...response.data,
          // Не забываем про парсинг фото, если они приходят строкой
          photos: typeof response.data.photos === 'string' ? JSON.parse(response.data.photos) : response.data.photos
        };
      }
    });
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    runInAction(() => this.isLoading = false);
  }
}


 setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  setSearchField(field: SearchFieldType) {
    this.searchField = field;
  }

  setStatusFilter(status: string | null) {
    this.statusFilter = status;
  }

  get filteredApplications() {
    const query = this.searchQuery.toLowerCase().trim();
    const status = this.statusFilter;

    return this.applications.filter((app) => {
      let matchesSearch = true;

      // Если есть запрос, проверяем только по ВЫБРАННОМУ полю
      if (query) {
        switch (this.searchField) {
          case 'name': {
            const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
            matchesSearch = fullName.includes(query);
            break;
          }
          case 'phone':
            matchesSearch = app.phone?.toLowerCase().includes(query) ?? false;
            break;
          case 'vin':
            matchesSearch = app.vin?.toLowerCase().includes(query) ?? false;
            break;
          case 'plate':
            matchesSearch = app.plate?.toLowerCase().includes(query) ?? false;
            break;
        }
      }

      const matchesStatus = !status || app.status === status;

      return matchesSearch && matchesStatus;
    });
  }

  get newApplicationsCount() {
    return this.applications.filter(app => app.status === 'WAITING').length;
  }

  get acceptedApplicationsCount() {
    return this.applications.filter(app => app.status === "ACCEPTED").length;
  }

  get readyApplicationsCount() {
    return this.applications.filter(app => app.status === "READY").length;
  }


  setSelectedApplication(application: ApplicationEntity | null) {
    this.selectedApplication = application;
  }

  clearSelectedApplication() {
    this.selectedApplication = null;
  }


}

export const applicationStore = new ApplicationStore();
