import { useHistory } from "react-router-dom";
import { IStorage, Nullable } from "./types";

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
  NAME = "name",
  CASE_OFFICE = "case_office",
  EMAIL = "email",
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
    return parseInt(this.get(Locals.USER_ID) || "-1");
  }

  public setUserId(userId: string) {
    this.set(Locals.USER_ID, userId);
  }

  public getName() {
    return this.get(Locals.NAME);
  }

  public setName(name: string) {
    this.set(Locals.NAME, name);
  }

  public getEmail() {
    return this.get(Locals.EMAIL);
  }

  public setEmail(email: string) {
    this.set(Locals.EMAIL, email);
  }

  public getCaseOffice() {
    return parseInt(this.get(Locals.CASE_OFFICE) || "-1");
  }

  public setCaseOffice(case_office: Nullable<number>) {
    this.set(Locals.CASE_OFFICE, case_office?.toString() || "");
  }

  public clear() {
    this.clearItems([
      Locals.ACCESS_TOKEN,
      Locals.USER_ID,
      Locals.NAME,
      Locals.CASE_OFFICE,
      Locals.EMAIL,
    ]);
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
