export interface IMultiLingualText {
  [key: string]: string;
}

export interface IMultiLingualImage {
  [key: string]: string;
}

export interface IMenuItem {
  title: IMultiLingualText;
  icon: string;
  order: number;
  link: string;
  disabled?: boolean;
}

export interface IGlobalSettings {
  splashScreen?: IMultiLingualImage;
  menu?: IMenuItem[];
}

export interface IUIComponent {
  title?: IMultiLingualText;
  description?: IMultiLingualText;
  type: string;
  subType: string;
  priority: number;
  backgroundImageUrl?: IMultiLingualImage;
  disabled?: boolean;
}

export interface IScreen {
  id: string;
  title?: IMultiLingualText;
  components?: IUIComponent[];
}

export interface IAppSettings {
  global?: IGlobalSettings;
  screens?: IScreen[];
  userId?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface IExperienceAppSettingsRole {
  hasMenu: boolean;
  hasManageGlobal: boolean;
  hasManageAccount: boolean;
}
