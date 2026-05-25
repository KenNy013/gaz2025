import type { ApplicationEntity } from "@/entities/application/types";
import { makeAutoObservable } from "mobx";


export type ModalKey = "CREATE_APPLICATION" | "EDIT_APPLICATION" | "VIEW_APPLICATION" | null;

class UIStore {
  activeModal: ModalKey = null;
  selectedApplication: ApplicationEntity | null = null;


  constructor() {
    makeAutoObservable(this);
  }

  openModal(key: ModalKey) {
    this.activeModal = key;

  }

  closeModal() {
    this.activeModal = null;
  }

  get isCreateApplicationOpen() {
    return this.activeModal === "CREATE_APPLICATION";
  }

  get isViewApplicationOpen() {
    return this.activeModal === "VIEW_APPLICATION";
  }

  setSelectedApplication(application: ApplicationEntity | null) {
    this.selectedApplication = application;
  }
}

export const uiStore = new UIStore();
