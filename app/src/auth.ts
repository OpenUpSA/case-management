import { useHistory } from "react-router-dom";

import { IStorage } from "./types";

abstract class Storage<T extends string> {
  private readonly storage: IStorage;

  public constructor(getStorage = (): IStorage => window.localStorage) {
    this.storage = getStorage();
  }

  protected get(key: T): string | null {
    return this.storage.getItem(key);
  }

  protected set(key: T, value: string): void {
    this.storage.setItem(key, value);
  }

  protected clearItem(key: T): void {
    this.storage.removeItem(key);
  }

  protected clearItems(keys: T[]): void {
    keys.forEach((key) => this.clearItem(key));
  }
}

enum Locals {
  ACCESS_TOKEN = "access_token",
  USER_ID = "user_id",
}

export class UserInfo extends Storage<Locals> {
  private static instance?: UserInfo;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserInfo();
    }

    return this.instance;
  }

  public getAccessToken() {
    return this.get(Locals.ACCESS_TOKEN);
  }

  public setAccessToken(accessToken: string) {
    this.set(Locals.ACCESS_TOKEN, accessToken);
  }

  public getUserId() {
    return parseInt(this.get(Locals.USER_ID) || "0");
  }

  public setUserId(userId: string) {
    this.set(Locals.USER_ID, userId);
  }

  public clear() {
    this.clearItems([Locals.ACCESS_TOKEN, Locals.USER_ID]);
  }
}

export const isLoggedIn = () => {
  const userInfo = UserInfo.getInstance();
  return userInfo.getAccessToken() !== null;
};

export const RedirectIfLoggedIn = () => {
  const history = useHistory();
  if (isLoggedIn()) {
    history.push("/clients");
  }
};

export const RedirectIfNotLoggedIn = () => {
  const history = useHistory();
  if (!isLoggedIn()) {
    history.push("/login");
  }
};
